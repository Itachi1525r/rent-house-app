import suratAreas from "../data/suratAreas";

function FilterBar({ filters, setFilters, onSearch }) {
  return (
    <div className="card p-3 mb-4">
      <div className="row g-3">
        {/* Rent Min */}
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Min Rent (₹)"
            value={filters.minRent}
            onChange={(e) =>
              setFilters({ ...filters, minRent: e.target.value })
            }
          />
        </div>

        {/* Rent Max */}
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Max Rent (₹)"
            value={filters.maxRent}
            onChange={(e) =>
              setFilters({ ...filters, maxRent: e.target.value })
            }
          />
        </div>

        {/* Bedrooms */}
        <div className="col-md-3">
          <select
            className="form-select"
            value={filters.bedrooms}
            onChange={(e) =>
              setFilters({ ...filters, bedrooms: e.target.value })
            }
          >
            <option value="">Bedrooms</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
          </select>
        </div>

        {/* Area */}
        <div className="col-md-3">
          <select
            className="form-select"
            value={filters.area}
            onChange={(e) => setFilters({ ...filters, area: e.target.value })}
          >
            <option value="">Select Area</option>
            {suratAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="btn btn-primary mt-3" onClick={onSearch}>
        Search Houses
      </button>
    </div>
  );
}

export default FilterBar;
