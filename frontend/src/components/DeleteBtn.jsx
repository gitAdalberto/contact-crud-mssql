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
    useToast,
    Text
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { useState } from 'react';
function InsertBtn({fetchContacts, id}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const  [loading, setLoading] = useState(false);
    const toast = useToast();

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

    const deleteContact = async () =>{
        setLoading(true);
        
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/contacts/${id}`,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al eliminar contacto!");
            
            createToast(
                "Eliminar contacto",
                "Eliminado exitosamente",
                "success"
            );
            if (fetchContacts) fetchContacts();
            onClose();
        } catch (error) {
            
            createToast(
                "Eliminar contacto",
                error.message,
                "error"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Button  onClick={onOpen} variant='solid' colorScheme='red' leftIcon={<DeleteIcon /> } iconSpacing={0} ></Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Eliminar Contacto</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <Text>¿Quieres eliminar este contacto?</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button  isLoading={loading} loadingText="Cargando" colorScheme='red' variant='solid' mr={3} onClick={deleteContact} >Eliminar</Button>
                        <Button onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default InsertBtn;
