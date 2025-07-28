import { useEffect, useState } from 'react';
import { fetchLogs, type AuditLogData } from '../../api/security';
const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogData[]>([]);
  
  const getLogs = async () => {
    try {
      const res = await fetchLogs();
      setLogs(res);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    }
  };

  const topFiveLogs = logs.slice(0, 5);

  useEffect(() => {
    getLogs()
  }, []);
  return (
    <div className="w-full flex flex-wrap px-10 py-7 bg-white rounded-lg shadow-md">
        <div>
            <h4 className="fw-500">Audit Log (Recent Activities)</h4>
            
            <div className="w-full text-sm space-y-3 my-5">
              {logs?.length ? (
                logs.slice(0, 5).map((log, index) => (
                <p key={index} className="text-xs">[{log.timestamp}] {log.details} - {log.performedBy}</p>
                ))
              ) : (
                <p>No logs yet.</p>
              )}
            </div>
        </div>
        <div className="w-full flex items-end justify-end">
            <button type="button"className="px-4 py-2 text-sm toothline-text-accent fw-600">
            View Full Audit Log
            </button>
        </div>
    </div>
  );
};

export default AuditLogs;
