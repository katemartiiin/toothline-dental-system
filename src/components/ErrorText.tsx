import { type FieldError } from '../utils/toastMessage';

type ErrorTextProps = {
  field: string;
  errors: FieldError[];
};

const ErrorText = ({ field, errors }: ErrorTextProps) => {
  const error = errors?.find(e => e.field === field);

  if (!error) return null;

  return (
    <p className="mt-1 text-xs toothline-error">
      {error.message}
    </p>
  );
};

export default ErrorText;