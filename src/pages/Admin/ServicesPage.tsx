import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import ErrorText from '../../components/ErrorText';
import { fetchServices, createService, updateService, deleteService, 
  type ServiceForm, type ServiceFilters } from '../../api/services';
import { type FieldError } from '../../utils/toastMessage';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { type PageOptions } from '../../utils/paginate';
interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}
const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [formErrors, setFormErrors] = useState<FieldError[]>([]);

  const defaultServiceForm = {
    name: '',
    description: '',
    durationMinutes: 0,
    price: 0,
  }

  const [serviceForm, setServiceForm] = useState<ServiceForm>(defaultServiceForm);

  const [serviceFilters, setServiceFilters] = useState<ServiceFilters>({
    name: "",
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setServiceFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => {
    const { name, value } = e.target;
    setSelectedService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectedService = (service: Service, type: string) => {
    setFormErrors([]);
    setSelectedService(service);
    
    type == 'update' ? setOpenEdit(true) : setOpenDelete(true);
  }

  const handleChangePage = (type: string) => {
    const newPage = type == 'next' ? serviceFilters.page + 1 : serviceFilters.page - 1;

    setServiceFilters({
      name: serviceFilters.name,
      page: newPage,
      size: serviceFilters.size
    })
  }

  const getServices = async () => {
    try {
      const res = await fetchServices(serviceFilters);
      setServices(res.content);
      setPageOptions({
        first: res.first,
        last: res.last,
        number: res.number,
        numberOfElements: res.numberOfElements,
        size: res.size,
        totalElements: res.totalElements,
        totalPages: res.totalPages
      });
    } catch (error) {
      console.error('Failed to fetch services', error);
    }
  };

  const createNewService = async () => {
    setFormErrors([]);
    const createResponse = await createService(serviceForm);
    
    if (createResponse.status == 400) {
      setFormErrors(createResponse.errors);
    } else {
      setServiceForm(defaultServiceForm);
      getServices();
    }
  };

  const editService = async () => {
    setFormErrors([]);
    const updateResponse = await updateService(selectedService.id, selectedService);
    
    if (updateResponse.status == 400) {
      setFormErrors(updateResponse.errors);
    } else {
      getServices();
      setOpenEdit(false);
    }
  };

  const deleteServ = async () => {
    const deleteResponse = await deleteService(selectedService.id);
    
    if (deleteResponse?.status == 200) {
      getServices();
      setOpenDelete(false);
    }
  };

  useEffect(() => {
    getServices();
  }, [serviceFilters]);
  return (
    <div className="w-full flex flex-wrap px-16 py-2">
      <div className="w-full flex flex-wrap">
        <div className="w-1/2 text-sm">
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 toothline-accent text-white rounded hover:toothline-primary"
          >
            + Add New Service
          </button>
        </div>

        <div className="w-1/2 text-sm flex justify-end">
          <input type="text" name="name" value={serviceFilters.name} onChange={handleFilterChange} className="rounded-md text-sm" placeholder="e.g., Tooth Cleaning" />
        </div>

        {/* Create Service */}
        <Modal
          isOpen={openCreate}
          title="Create New Service"
          onClose={() => setOpenCreate(false)}
          >
            <div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Service Name</label>
                  <input type="text" id="serviceName" name="name" value={serviceForm.name} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
                  <ErrorText field="name" errors={formErrors} />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Description</label>
                  <textarea id="description" name="description" value={serviceForm.description} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" placeholder="Brief description of the service"></textarea>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Price ($)</label>
                  <input type="number" id="price" name="price" value={serviceForm.price} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" step="0.01" min="0" placeholder="e.g., 250.00" />
                  <ErrorText field="price" errors={formErrors} />
                </div>
                <div>
                  <label className="block text-sm fw-500 toothline-text">Duration</label>
                  <input type="number" id="duration" name="durationMinutes" value={serviceForm.durationMinutes} onChange={handleFormChange} className="mt-1 block w-full rounded-md text-sm" min="1" placeholder="e.g., 60" />
                  <ErrorText field="durationMinutes" errors={formErrors} />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => createNewService()}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Save Service
                </button>
              </div>
            </div>
        </Modal>

        {/* Edit Service */}
        <Modal
          isOpen={openEdit}
          title="Edit Service"
          onClose={() => setOpenEdit(false)}
          >
            <div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Service Name</label>
                  <input type="text" id="serviceName" name="name" value={selectedService.name} onChange={handleFormUpdate} className="mt-1 block w-full rounded-md text-sm" placeholder="e.g., Jane Doe" />
                  <ErrorText field="name" errors={formErrors} />
              </div>
              <div className="mb-4">
                  <label className="block text-sm fw-500 toothline-text">Description</label>
                  <textarea id="serviceDescription" name="description" value={selectedService.description} onChange={handleFormUpdate} className="mt-1 block w-full rounded-md text-sm" placeholder="Brief description of the service"></textarea>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm fw-500 toothline-text">Price ($)</label>
                  <input type="number" id="servicePrice" name="price" value={selectedService.price} onChange={handleFormUpdate} className="mt-1 block w-full rounded-md text-sm" step="0.01" min="0" placeholder="e.g., 250.00" />
                  <ErrorText field="price" errors={formErrors} />
                </div>
                <div>
                    <label className="block text-sm fw-500 toothline-text">Duration</label>
                    <input type="number" id="serviceDuration" name="durationMinutes" value={selectedService.durationMinutes} onChange={handleFormUpdate} className="mt-1 block w-full rounded-md text-sm" min="1" placeholder="e.g., 60" />
                    <ErrorText field="durationMinutes" errors={formErrors} />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpenEdit(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={()=> editService()}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Update Service
                </button>
              </div>
            </div>
        </Modal>

        {/* Delete Schedule */}
        <Modal
          isOpen={openDelete}
          title="Delete Service"
          onClose={() => setOpenDelete(false)}
          >Are you sure you want to delete this service? This action cannot be undone.
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setOpenDelete(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => deleteServ()}
              className="px-4 py-2 toothline-bg-error text-white rounded hover:bg-red-600"
            >
              Delete Service
            </button>
          </div>
        </Modal>

      </div>
      {/* Table */}
      <div className="w-full flex flex-wrap px-10 py-5 bg-white rounded-lg shadow-md my-5">
        <h2 className="fw-600 text-xl mb-5">Clinic Services</h2>

        {/* Table Headers */}
        <div className="w-full grid grid-cols-7 gap-2 px-3 py-2 toothline-bg-light border-b border-gray-200 text-xs toothline-text">
          <p className="col-span-2">SERVICE NAME</p>
          <p className="col-span-2">DESCRIPTION</p>
          <p>PRICE</p>
          <p>DURATION</p>
          <p>ACTIONS</p>
        </div>

        {/* Table Rows */}
        {services?.length ? (
          services.map((service) => (
          <div key={service.id} className="w-full grid grid-cols-7 gap-2 px-3 py-2 toothline-bg-light shadow-sm text-sm my-1">
            <p className="col-span-2">{service.name}</p>
            <p className="col-span-2 truncate">{service.description}</p>
            <p>₱ {service.price}</p>
            <p>{service.durationMinutes}</p>
            <div className="space-x-3">
              <button type="button" onClick={() => handleSelectedService(service, 'update')} className="toothline-text-accent fw-500">Edit</button>
              <button type="button" onClick={() => handleSelectedService(service, 'delete')} className="toothline-error fw-500">Delete</button>
            </div>
          </div>
          ))
        ) : (
          <p className="w-full bg-gray-50 my-1 p-1 text-gray-500 italic text-center">No services added yet.</p>
        )}

        {/* Pagination */}
        <div className="w-full flex justify-end toothline-bg-light border border-gray-200 p-3 my-1 text-sm space-x-7">
          <span className="my-auto">{ pageOptions.totalElements } total entries</span>
          <div>
            <span className="my-auto mx-2">Show</span>
            <select id="size" name="size" value={serviceFilters.size} onChange={handleFilterChange} className="rounded-md text-sm">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
            </select>
          </div>
          <button type="button" onClick={() => handleChangePage('prev')} disabled={pageOptions.first} className={`flex p-1 ${
                pageOptions.first ? 'text-gray-400' : 'hover:toothline-text-primary'
              }`}>
            <ArrowLeft size={25} className="my-auto" />
            <span className="mx-1 my-auto">Previous</span>
          </button>
          <button type="button" onClick={() => handleChangePage('next')} disabled={pageOptions.last} className={`flex p-1 ${
                pageOptions.last ? 'text-gray-400' : 'hover:toothline-text-primary'
              }`}>
            <span className="mx-1 my-auto">Next</span>
            <ArrowRight size={25} className="my-auto" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ServicesPage;
