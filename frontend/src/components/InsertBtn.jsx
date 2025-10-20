import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    Button,
    FormControl,
    FormLabel,
    useToast
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useState } from 'react';
function InsertBtn({fetchContacts}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const  [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState(null);
    const [apellido, setApellido] = useState(null);
    const [email, setEmail] = useState(null);
    const [telefono, setTelefono] = useState(null);
    const [dpi, setDpi] = useState(null);
    const toast = useToast();

    const cleanInputs = ()=>{
        setNombre("");
        setApellido("");
        setEmail("");
        setTelefono("");
        setDpi("");
    }

    const createToast = (title, desc, status)=>{
        toast({
            title: title,
            description: desc,
            status: status,
            duration: 5000,
            position: 'bottom',
            isClosable: true
        });
    }

    const insertContact = async () =>{
        setLoading(true);
        
        if (!nombre || !apellido || !email || !telefono || !dpi) {
            setLoading(false);
            return createToast('Insertar contacto', 'No puedes dejar campos vacios!', 'error');
        };
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/contacts`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombre, apellido, email, telefono, dpi})
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al insertar contacto!");
            
            createToast(
                "Insertar contacto",
                "Insertado exitosamente",
                "success"
            );
            cleanInputs();
            if (fetchContacts) fetchContacts();
            onClose();
        } catch (error) {
            
            createToast(
                "Insertar contacto",
                error.message,
                "error"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Button  onClick={onOpen} variant='solid' colorScheme='teal' leftIcon={<AddIcon /> }>Añadir</Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Añade un nuevo Contacto</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <FormControl>
                            <FormLabel>Nombre</FormLabel>
                            <Input placeholder='Nombre' value={nombre} maxLength={100} onChange={(e)=>setNombre(e.target.value)} type='text'/>
                        </FormControl>
                        <FormControl mt='0.5em' >
                            <FormLabel>Apellido</FormLabel>
                            <Input placeholder='Apellido' value={apellido} maxLength={150} onChange={(e)=>setApellido(e.target.value)} type='text' />
                        </FormControl>
                        <FormControl mt='0.5em' >
                            <FormLabel>Email</FormLabel>
                            <Input placeholder='Email' value={email} maxLength={100} onChange={(e)=>setEmail(e.target.value)} type='email' />
                        </FormControl>
                        <FormControl mt='0.5em' >
                            <FormLabel>Telefono</FormLabel>
                            <Input placeholder='Telefono' maxLength={8} value={telefono}  onChange={(e)=>setTelefono(e.target.value)} type='tel' />
                        </FormControl>
                        <FormControl mt='0.5em' >
                            <FormLabel>DPI</FormLabel>
                            <Input placeholder='DPI' maxLength={20} value={dpi}  onChange={(e)=>setDpi(e.target.value)} type='number' />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button  isLoading={loading} loadingText="Cargando" colorScheme='blue' mr={3} onClick={insertContact} >Guardar</Button>
                        <Button onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default InsertBtn;
