import { InputGroup, InputGroupInput, InputGroupAddon } from '@/shared/components/ui/input-group'
import { SearchIcon } from 'lucide-react'

type CoinSearchProps = {
  search: string
  setSearch: (search: string) => void
}

const CoinSearch = ({ search, setSearch }: CoinSearchProps) => {
  return (
    <InputGroup aria-label="Search">
      <InputGroupInput
        name="search"
        id="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <InputGroupAddon>
        <SearchIcon className="w-4 h-4" />
      </InputGroupAddon>
    </InputGroup>
  )
}

export default CoinSearch
