import { Dialog, DialogBody, Button } from "@material-tailwind/react";
import { LoadingSpinner } from "components/Svgs";
import { useLayout } from "layout";
import { useEffect, useState } from "react";
import API from "utils/API";
import { Lesson } from "./Table";

export interface Course {
  id?: number;
  name?: string;
  description?: string;
  started_at?: Date;
  price?: number;
  user_teacher_id?: number;
  photo_path?: string;
  category_id?: number;
  is_available?: boolean;
  is_subscribed?: boolean;
  category?: Category;
  sections?: Section[];
  teacher?: Teacher;
}

export interface Category {
  id?: number;
  name?: string;
  type?: null;
  description?: string;
}

export interface Section {
  id?: number;
  course_id?: number;
  name?: string;
  capacity?: null;
  days_of_week?: DaysOfWeek[];
  sessions?: Session[];
}

export interface DaysOfWeek {
  duration?: number;
  time?: string;
  day?: number;
}

export interface Session {
  id?: number;
  lesson_id?: number;
  type?: null;
  time?: string;
  date?: Date;
  duaration?: number;
  section_id?: number;
  lesson?: Lesson;
}

export interface Teacher {
  id?: number;
  name?: string;
  email?: string;
  role_id?: number;
  national_number?: string;
  central_number?: string;
  financial_id?: null;
  surname?: null;
  birth_date?: Date;
  father_name?: string;
  mother_name?: string;
  personal_picture?: string;
  deleted_at?: null;
}

interface TransactionsModalProps {
  handleClose: () => void;
  _refresh: (id: any) => void;
  open: boolean;
  modalData?: Lesson | null;
  handleOpen: () => void;
  course: Course | null
}
const LessonsModal = ({
  modalData,
  _refresh,
  handleClose,
  open,
  handleOpen,
  course
}: TransactionsModalProps) => {
  const { user, notify } = useLayout();

  const [loading, setLoading] = useState(false);
  const [loadingStudens, setLoadingStudens] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState<Lesson>({
    id: 0,
    name: "",
    description: "",
    sessions: [],
    course_id: course?.id
  });
  useEffect(() => {
    if (modalData) {
      setFormData(modalData)
    }
  }, [modalData])
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await API.post(
        "/api/financials/deposit_amount",
        formData,
        (data) => data,
        (e) => {
          notify(e);
        },
        {
          Authorization: `Bearer ${user?.access_token}`,
        }
      );

      if (response.code === 200) {
        console.log(response);
        setLoading(false);
        handleClose();
        _refresh(formData?.id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Dialog className="z-[999]" open={open} handler={handleOpen}>
      <DialogBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="mb-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Father Name Field */}
            <div className="mb-1">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* Name Field */}
            <div className="mb-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Sessions (will be auto created for the following sections)
              </label>
              <div className="flex flex-col w-full">
                {course?.sections?.map((section) => <div className="shadow-md rounded-[10px] p-[10px] mt-[10px]">
                  <div className="text-[#6f6f6f]">  {section?.name} </div>
                </div>)}
              </div>

            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="text"
              color="red"
              onClick={handleClose}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <button
              disabled={loading}
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75"
            >
              {loading ? <LoadingSpinner /> : "Save"}
            </button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default LessonsModal;
