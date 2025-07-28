const AuditLogs: React.FC = () => {
  return (
    <div className="w-full flex flex-wrap px-10 py-7 bg-white rounded-lg shadow-md">
        <div>
            <h4 className="fw-500">Audit Log (Recent Activities)</h4>
            
            <div className="w-full text-sm space-y-3 my-5">
                <p>[2025-06-28 14:30] Admin User changed password.</p>
                <p>[2025-06-28 14:30] Dr. Melissa Chen updated schedule #1.</p>
                <p>[2025-06-28 14:30] New service "Teeth Whitening" added.</p>
                <p>[2025-06-28 14:30] Patient PT-1001 record updated.</p>
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
