import { useForm } from 'react-hook-form'
import axios from "axios"

export const CreateBug = () => {

  const{register,handleSubmit} = useForm()
  const submitHandle = async (data) =>{
    const res = await axios.post("http://localhost:2500/bug/create", data);
    console.log(res);
  }

  return (
    <div className='flex justify-center bg-gradient-to-br from-purple-500 to-blue-300 '>
      <div className='border-1 bg-white p-8 rounded-2xl shadow-xl m-8 w-150 justify-center'>
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Create Bug</h1>
        <form onSubmit={handleSubmit(submitHandle)}>
          <div>
            <label className='block text-gray-600 font-bold'>Bug Title : </label>
            <input className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' type="text" {...register('title')}/>
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Description : </label>
            <input className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' type='text' {...register('description')}/>
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Project Name :</label>
            <input className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' type="text"  {...register('projectName')}/>
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Select the component : </label>
            <select className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' {...register('type')}>
              <option value=""></option>
              <option value="UI based">UI Based</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="API">API</option>
            </select>
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Priority : </label>
            <select className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' {...register('priority')}>
              <option value=""></option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Step To Reproduce</label>
            <input className='border-1 w-full px-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' type="text" {...register('reproduce')} placeholder=''/>
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Expected Result</label>
            <input className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:rimg-blue-400' type="text" {...register('expectedResult')} placeholder='Expected results'/>
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Actual Result</label>
            <input className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:rimg-blue-400' type="text" {...register('actualResult')} placeholder='Expected results'/>
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Due Date</label>
            <input className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:rimg-blue-400' type='date'  {...register('dueDate')} placeholder='Enter the date'/>
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Upload File/Image : </label>
            <input className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' {...register('uploadedDoc')} type='file' />
          </div><br />
          <div>
            <button onClick={handleSubmit} className='border-1 w-full px-2 rounded-lg bg-green-400 font-bold'>Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}
