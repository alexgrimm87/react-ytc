import {FC, useEffect, useState} from "react";
import {useForm, useFieldArray, Controller} from "react-hook-form";
import {fetchUsers} from "../../services/api.js";
import ButtonLink from "../Button";
import Preloader from "../Preloader";
import ErrorMessage from "../ErrorMessage";
import styles from "./index.module.scss";

type FormValues = {
  users: {
    username: string;
    email: string
  }[];
};

const UsersForm: FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {control, handleSubmit, setValue, watch} = useForm<FormValues>({
    defaultValues: {
      users: []
    }
  });
  const {fields, insert, remove} = useFieldArray({
    control,
    name: 'users'
  });
  const users = watch('users');
  const isSaveButtonDisabled = fields.length === 0 || users.some(user => !user.username || !user.email);

  const onSubmit = (data: FormValues) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form data:', data);
        resolve(data);
      }, 1000);
    });
  };

  const onAddNew = () => {
    insert(0, {username: '', email: ''});
  }

  const onAddAfter = (index) => {
    insert(index + 1, {username: '', email: ''})
  }

  const onDelete = (index) => {
    remove(index)
  }

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUsers();
        const initialData = data.map((user) => ({
          username: user.username,
          email: user.email,
        }));
        setValue('users', initialData);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError('Error fetching users');
        }
      }
    })();
  }, [setValue]);


  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <div className={styles.topPanel}>
        <h1>Users</h1>
        <ButtonLink
          type="button"
          color="#00b93f"
          fontSize="16"
          fontWeight="700"
          textDecoration="underline"
          onClick={onAddNew}
        >
          Add New
        </ButtonLink>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formInner}>
          {fields.map((field, index) => (
            <div className={styles.row} key={field.id}>
              <Controller
                name={`users.${index}.username`}
                control={control}
                render={({field}) => (
                  <input
                    {...field}
                    className={styles.input}
                    placeholder="Username"
                  />
                )}
              />
              <Controller
                name={`users.${index}.email`}
                control={control}
                render={({field}) => (
                  <input
                    {...field}
                    className={styles.input}
                    placeholder="Email"/>
                )}
              />
              <ButtonLink
                type="button"
                color="#0500ff"
                onClick={() => onAddAfter(index)}
              >
                Add after
              </ButtonLink>
              <ButtonLink
                type="button"
                color="#f00"
                onClick={() => onDelete(index)}
              >
                Delete
              </ButtonLink>
            </div>
          ))}
        </div>
        {fields.length > 0 && (
          <button
            type="submit"
            className={styles.button}
            disabled={isSaveButtonDisabled}
          >
            Save Changes
          </button>
        )}
      </form>
    </>
  );
};

export default UsersForm;
