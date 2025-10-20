import { Flex, Spinner, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import InsertBtn from "./components/InsertBtn";
import UpdateBtn from "./components/UpdateBtn";
import DeleteBtn from "./components/DeleteBtn";
import RefreshBtn from "./components/RefreshBtn";

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contacts`);
      if (res.status === 404 ) {
         setContacts([]);
         return;
      }
      if (!res.ok) throw new Error("Error al obtener contactos");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);



  if (loading) return <Flex w='100vw' h='100vh' align='center' justifyContent='center' ><Spinner size='xl' /></Flex>;
  if (error) return <Flex w='100vw' h='100vh' align='center' justifyContent='center' >Error: {error}</Flex>;


  return (
    <Flex direction='column' align='center' justifyContent='center' p='1em'>
      <Flex mb='1em' align='center' justifyContent='center' w='100%' >
        <Heading>Crud de Contactos</Heading>
      </Flex>
      <Flex mb='1em' align='center' justifyContent='flex-start' w='100%' gap='1em'>
        <InsertBtn  fetchContacts={fetchContacts} />
        <RefreshBtn />
      </Flex>
      <TableContainer w='100%'  border='1px solid gray' borderRadius='xl'>
        <Table variant='striped'   >          
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Apellido</Th>
              <Th>Email</Th>
              <Th>Telefono</Th>
              <Th>DPI</Th>
              <Th>Accion</Th>
            </Tr>
          </Thead>
          <Tbody>
            {contacts.map((c, index) => (
              <Tr key={index}>
                <Td>{c.Nombre}</Td>
                <Td>{c.Apellido}</Td>
                <Td>{c.Email}</Td>
                <Td>{c.Telefono}</Td>
                <Td>{c.DPI}</Td>
                <Td>
                  <Flex direction='row' gap='1em'>
                    <UpdateBtn fetchContacts={fetchContacts} {...c}/>
                    <DeleteBtn fetchContacts={fetchContacts} id={c.Id}/>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}

export default App
