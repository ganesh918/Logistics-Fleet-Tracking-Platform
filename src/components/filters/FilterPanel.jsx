import { Filter, RotateCcw, Search } from 'lucide-react';
import { useFleet } from '../../context/FleetContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect, useState } from 'react';
import { driverStatusLabel, shipmentStatusLabel, vehicleStatusLabel, } from '../../utils/statusStyles';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
export function FilterPanel({ scope = 'all' }) {
    const { filters, setFilters, resetFilters } = useFleet();
    const [searchLocal, setSearchLocal] = useState(filters.search);
    const debouncedSearch = useDebounce(searchLocal, 250);
    useEffect(() => {
        setFilters({ search: debouncedSearch });
    }, [debouncedSearch, setFilters]);
    const vehicleOptions = [
        { value: 'all', label: 'All statuses' },
        ...Object.entries(vehicleStatusLabel).map(([value, label]) => ({ value, label })),
    ];
    const driverOptions = [
        { value: 'all', label: 'All statuses' },
        ...Object.entries(driverStatusLabel).map(([value, label]) => ({ value, label })),
    ];
    const shipmentOptions = [
        { value: 'all', label: 'All statuses' },
        ...Object.entries(shipmentStatusLabel).map(([value, label]) => ({ value, label })),
    ];
    return (<div className="fleet-filter-enter fleet-card rounded-2xl border border-surface-200/80 bg-panel p-4 shadow-sm dark:border-surface-200/15">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-surface-800">
        <Filter className="size-4 text-brand-600"/>
        Search & filters
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-surface-800">
            <Search className="size-3.5 opacity-60"/>
            Search
          </label>
          <input value={searchLocal} onChange={(e) => setSearchLocal(e.target.value)} placeholder="ID, name, plate, location…" className="fleet-field block w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-panel"/>
        </div>
        {(scope === 'all' || scope === 'vehicles') && (<Select label="Vehicle status" value={filters.vehicleStatus} onChange={(e) => setFilters({ vehicleStatus: e.target.value })} options={vehicleOptions}/>)}
        {(scope === 'all' || scope === 'drivers') && (<Select label="Driver status" value={filters.driverStatus} onChange={(e) => setFilters({ driverStatus: e.target.value })} options={driverOptions}/>)}
        {(scope === 'all' || scope === 'shipments') && (<Select label="Shipment status" value={filters.shipmentStatus} onChange={(e) => setFilters({ shipmentStatus: e.target.value })} options={shipmentOptions}/>)}
        <Input label="Date from" type="date" value={filters.dateFrom} onChange={(e) => setFilters({ dateFrom: e.target.value })}/>
        <Input label="Date to" type="date" value={filters.dateTo} onChange={(e) => setFilters({ dateTo: e.target.value })}/>
        <Input label="Location" placeholder="City, hub, address…" value={filters.location} onChange={(e) => setFilters({ location: e.target.value })} className="xl:col-span-2"/>
      </div>
      <div className="mt-3 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => {
            resetFilters();
            setSearchLocal('');
        }}>
          <RotateCcw className="size-3.5"/>
          Reset filters
        </Button>
      </div>
    </div>);
}
