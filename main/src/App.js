import './App.css';
import { Table, Button, Modal, Form, Input} from 'antd';
import axios from 'axios';
import React,{useState, useEffect} from 'react';


function App() {
  const [state, setState] = useState([]);

  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({title: '', author: ''})
  
  const [change, setChange] = useState({ title:'', author:''})
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);


 
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    postBooks()
  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showsModal = () => {
    setModalOpen(true);
  };
 
  const handlCancel = () => {
    setModalOpen(false);
  };


  useEffect(() => {
    getBooks();
  }, []);

  
  const getBooks = async() => {
    await axios.get('http://localhost:4000/books').then(response => {
      setLoading(false);
      setState(response.data)
    })
  }



  const postBooks = async() => {
    await axios.post('http://localhost:4000/books', form).then(response =>{

      setState(prev => ([...prev, response.data]))
      setForm(
        {title: '', author: ''}
      )
      setIsModalOpen(false);
    })
  }



  const delBooks = async(id) => {
    console.log(id)
    const res = await axios.delete(`http://localhost:4000/books/${id}`);
    if(res.data === 'OK'){
      setState(prev => JSON.parse(JSON.stringify(prev)).filter(book => book.id !== id))
        }
  }



const putBooks = async(id) =>{

  const res = await axios.put(`http://localhost:4000/books/${id}`, change);


  if(res.status === 200){
    setState(state.map((change) => {
      return change.id === id ? {...res.data}:change;
    }))
    handlCancel();
  }
}


  const columns = [

    {
      title:"ID",
      dataIndex:'id'

    },
   
    {
      title:'Title',
      dataIndex:'title'
    },
    {
      title:'Author',
      dataIndex:'author'
    },
    {
      title:'Actions',

      render({id}) {
        return(
          <>
          <Button onClick={showsModal} style={{marginRight: '15px'}}>Edit</Button>

          <Modal title="Edit" open={modalOpen} onOk={() => putBooks(id)} onCancel={handlCancel}>
          <Form >
            <Form.Item label="Title">
            <Input  value={change.title} onChange={(e) => setChange(prev => ({...prev, title: e.target.value}))}></Input>
            </Form.Item>
            <Form.Item label="Author">
            <Input value={change.author} onChange={ (e) => setChange(prev => ({...prev, author: e.target.value}))}></Input>
            </Form.Item>
          </Form>
          </Modal>



          <Button onClick={()=>delBooks(id)}>
            Delete
            </Button>
       
          </>
          
        )
      }
    }
  ]

  return (
    <div className="App">
     
      <Table
      loading={loading}
        columns={columns}
        dataSource={state}
        rowKey={"id"}>
        </Table>


     
      <Button type="primary" onClick={showModal}>
        Add a book
      </Button>
      <Modal title="Adding a book" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <Form>
      <Form.Item label="Title">       
         <Input value={form.title} onChange={(e) => setForm(prev => ({...prev, title: e.target.value}))}></Input>
      </Form.Item>

        <Form.Item label="Author">      
          <Input value={form.author} onChange={ (e) => setForm(prev => ({...prev, author: e.target.value}))}></Input>
        </Form.Item>

      </Form>

      </Modal>
   
     
    </div>
  );
}

export default App;
