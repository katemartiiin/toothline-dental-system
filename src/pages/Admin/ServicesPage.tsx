import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Plus, Search, Edit3, Trash2, Stethoscope, DollarSign, Clock, FileText, Loader2 } from 'lucide-react';
import Modal from '../../components/Modal';
import ErrorText from '../../components/ErrorText';
import Pagination from '../../components/Pagination';
import { type FieldError } from '../../utils/toastMessage';
import { createChangeHandler } from '../../utils/changeHandler';
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  type ServiceForm,
  type ServiceFilters
} from '../../api/services';
import { type PageOptions, updatePageOptions } from '../../utils/paginate';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

const tableRowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultServiceForm = {
    name: '',
    description: '',
    durationMinutes: 0,
    price: 0
  };

  const [serviceForm, setServiceForm] = useState<ServiceForm>(defaultServiceForm);

  const [serviceFilters, setServiceFilters] = useState<ServiceFilters>({
    name: '',
    page: 0,
    size: 10
  });

  const [pageOptions, setPageOptions] = useState<PageOptions>({
    first: true,
    last: false,
    number: 0,
    numberOfElements: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  const [selectedService, setSelectedService] = useState<Service>({
    id: 0,
    name: '',
    description: '',
    price: 0,
    durationMinutes: 0
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleFilterChange = createChangeHandler(setServiceFilters);
  const handleFormChange = createChangeHandler(setServiceForm);
  const handleFormUpdate = createChangeHandler(setSelectedService);

  const handleSelectedService = (service: Service, type: string) => {
    setFormErrors([]);
    setSelectedService(service);
    type === 'update' ? setOpenEdit(true) : setOpenDelete(true);
  };

  const handleChangePage = (type: string) => {
    const newPage = type === 'next' ? serviceFilters.page + 1 : serviceFilters.page - 1;
    setServiceFilters({
      name: serviceFilters.name,
      page: newPage,
      size: serviceFilters.size
    });
  };

  const getServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetchServices(serviceFilters);
      setServices(res.content);
      updatePageOptions(setPageOptions, res);
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewService = async () => {
    setIsSubmitting(true);
    setFormErrors([]);
    const createResponse = await createService(serviceForm);

    if (createResponse?.status === 400) {
      setFormErrors(createResponse.errors);
    } else {
      setServiceForm(defaultServiceForm);
      setOpenCreate(false);
      getServices();
    }
    setIsSubmitting(false);
  };

  const editService = async () => {
    setIsSubmitting(true);
    setFormErrors([]);
    const updateResponse = await updateService(selectedService.id, selectedService);

    if (updateResponse?.status === 400) {
      setFormErrors(updateResponse.errors);
    } else {
      getServices();
      setOpenEdit(false);
    }
    setIsSubmitting(false);
  };

  const deleteServ = async () => {
    setIsSubmitting(true);
    const deleteResponse = await deleteService(selectedService.id);

    if (deleteResponse?.status === 200) {
      getServices();
      setOpenDelete(false);
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    getServices();
  }, [serviceFilters]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <div className="px-8 py-4">
      {/* Header Actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between mb-6"
      >
        <motion.button
          onClick={() => {
            setFormErrors([]);
            setServiceForm(defaultServiceForm);
            setOpenCreate(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 toothline-accent text-white rounded-xl 
                     hover:toothline-accent-hover transition-all duration-200 shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          <span className="font-medium">Add New Service</span>
        </motion.button>

        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="name"
            value={serviceFilters.name}
            onChange={handleFilterChange}
            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
                       focus:border-teal-300 focus:ring-2 focus:ring-teal-100 outline-none
                       transition-all duration-200 w-64"
            placeholder="Search services..."
          />
        </div>
      </motion.div>

      {/* Main Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-xl">
              <Stethoscope size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Clinic Services</h2>
              <p className="text-sm text-gray-500">Manage your dental service offerings</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 size={32} className="animate-spin text-teal-500 mx-auto" />
                    <p className="text-gray-500 mt-2">Loading services...</p>
                  </td>
                </tr>
              ) : services?.length ? (
                <AnimatePresence mode="popLayout">
                  {services.map((service, index) => (
                    <motion.tr
                      key={service.id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 
                                          flex items-center justify-center text-purple-600">
                            <Stethoscope size={18} />
                          </div>
                          <span className="font-medium text-gray-800">{service.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm truncate max-w-xs" title={service.description}>
                          {service.description || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 
                                         rounded-full text-sm font-medium">
                          <DollarSign size={14} />
                          {formatCurrency(service.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
                          <Clock size={14} className="text-gray-400" />
                          {service.durationMinutes} mins
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => handleSelectedService(service, 'update')}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit service"
                          >
                            <Edit3 size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleSelectedService(service, 'delete')}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete service"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Stethoscope size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No services found</p>
                      <p className="text-gray-400 text-sm mt-1">Add your first service to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          pageOptions={pageOptions}
          filters={serviceFilters}
          onFilterChange={handleFilterChange}
          onPageChange={handleChangePage}
        />
      </motion.div>

      {/* Create Service Modal */}
      <Modal isOpen={openCreate} title="Add New Service" onClose={() => setOpenCreate(false)}>
        <div className="space-y-5">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Stethoscope size={16} className="mr-2 text-teal-500" />
              Service Name <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={serviceForm.name}
              onChange={handleFormChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                         transition-all duration-200"
              placeholder="e.g., Tooth Cleaning"
            />
            <ErrorText field="name" errors={formErrors} />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="mr-2 text-teal-500" />
              Description
            </label>
            <textarea
              name="description"
              value={serviceForm.description}
              onChange={handleFormChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                         transition-all duration-200 resize-none"
              placeholder="Brief description of the service"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="mr-2 text-teal-500" />
                Price (₱) <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={serviceForm.price}
                onChange={handleFormChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                           focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                           transition-all duration-200"
                placeholder="e.g., 250.00"
              />
              <ErrorText field="price" errors={formErrors} />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="mr-2 text-teal-500" />
                Duration (mins) <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="number"
                name="durationMinutes"
                value={serviceForm.durationMinutes}
                onChange={handleFormChange}
                min="1"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                           focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                           transition-all duration-200"
                placeholder="e.g., 60"
              />
              <ErrorText field="durationMinutes" errors={formErrors} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <motion.button
              type="button"
              onClick={() => setOpenCreate(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={createNewService}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 toothline-accent text-white rounded-xl
                         hover:toothline-accent-hover transition-all duration-200 disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              Save Service
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Edit Service Modal */}
      <Modal isOpen={openEdit} title="Edit Service" onClose={() => setOpenEdit(false)}>
        <div className="space-y-5">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Stethoscope size={16} className="mr-2 text-teal-500" />
              Service Name <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={selectedService.name}
              onChange={handleFormUpdate}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                         transition-all duration-200"
              placeholder="e.g., Tooth Cleaning"
            />
            <ErrorText field="name" errors={formErrors} />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="mr-2 text-teal-500" />
              Description
            </label>
            <textarea
              name="description"
              value={selectedService.description}
              onChange={handleFormUpdate}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                         focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                         transition-all duration-200 resize-none"
              placeholder="Brief description of the service"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="mr-2 text-teal-500" />
                Price (₱) <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={selectedService.price}
                onChange={handleFormUpdate}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                           focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                           transition-all duration-200"
                placeholder="e.g., 250.00"
              />
              <ErrorText field="price" errors={formErrors} />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="mr-2 text-teal-500" />
                Duration (mins) <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="number"
                name="durationMinutes"
                value={selectedService.durationMinutes}
                onChange={handleFormUpdate}
                min="1"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm
                           focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none
                           transition-all duration-200"
                placeholder="e.g., 60"
              />
              <ErrorText field="durationMinutes" errors={formErrors} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <motion.button
              type="button"
              onClick={() => setOpenEdit(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={editService}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 toothline-accent text-white rounded-xl
                         hover:toothline-accent-hover transition-all duration-200 disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Edit3 size={18} />}
              Update Service
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Delete Service Modal */}
      <Modal isOpen={openDelete} title="Delete Service" onClose={() => setOpenDelete(false)} size="sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} className="text-red-500" />
          </div>
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete <span className="font-semibold">{selectedService.name}</span>?
          </p>
          <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>

          <div className="flex justify-center gap-3">
            <motion.button
              type="button"
              onClick={() => setOpenDelete(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              onClick={deleteServ}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl
                         hover:bg-red-600 transition-all duration-200 disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              Delete Service
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ServicesPage;
