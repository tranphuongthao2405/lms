import React, { useState } from 'react';
import { Input } from 'antd';

const { Search } = Input;

function SearchBar({ refreshFunction }) {
  const [searchTerm, setSearchTerm] = useState('');
  const onSearchTermChange = (evt) => {
    setSearchTerm(evt.target.value);
    refreshFunction(evt.target.value);
  };

  return (
    <div>
      <Search
        value={searchTerm}
        onChange={onSearchTermChange}
        placeholder="Search..."
      />
    </div>
  );
}

export default SearchBar;
