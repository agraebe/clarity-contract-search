import { Input } from "@chakra-ui/react"

export default function Search(props: SearchProps) {
  return (
    <Input placeholder="Search contracts ..." size="lg" isFullWidth={true} />
  );
}
interface SearchProps {}
