import { Button } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons"
function RefreshBtn({fetchContacts}) {
    return <Button variant='outline' colorScheme="blue" onClick={fetchContacts} leftIcon={<RepeatIcon />}>Refrescar</Button>
};

export default RefreshBtn;
