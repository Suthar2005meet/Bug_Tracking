import axios from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

export const EditProject = () => {

  const { register, handleSubmit, reset } = useForm();
  const { id } = useParams();

  const getData = async () => {
    try {
      const res = await axios.get(`/project/details/${id}`);
      console.log(res.data.data);

      // ✅ Set form default values
      reset(res.data.data);

    } catch (err) {
      console.log(err);
    }
  };

  const submitHandle = async (data) => {
    try {
      const res = await axios.put(`/project/update/${id}`, data);
      console.log("Updated:", res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandle)}>
        <div>
          <label>Project Name : </label>
          <input type="text" {...register('projectName')} />
        </div>
        <div>
          <label>Description : </label>
          <input type="text" {...register('description')} />
        </div>
        <div>
          <label>Priority : </label>
          <select {...register('priority')}>
            <option value=""></option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label>Start Date : </label>
          <input type="text" {...register('startDate')} />
        </div>
        <div>
          <labek>Due Date : </labek>
          <input type="text" {...register('dueDate')} />
        </div>
        {/* <div>
          <label>Document : </label>
          <input type="" {...register('document')} />
        </div> */}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};