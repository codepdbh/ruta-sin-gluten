'use client';

import { useState } from 'react';

export function SearchBox() {
  const [value, setValue] = useState('');

  return (
    <div className="search-box">
      <label htmlFor="future-search">Buscar calle o barrio</label>
      <div className="search-box__controls">
        <input
          id="future-search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Preparado para geocoding futuro"
        />
        <button type="button" disabled>
          Proximamente
        </button>
      </div>
    </div>
  );
}
