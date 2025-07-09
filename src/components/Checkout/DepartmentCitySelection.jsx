import { useEffect, useState } from 'react';
import { FaCity } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { getCitiesDepartments, getDepartments } from '../../api/Colombia';

const DepartamentCitySelect = ({ onChange }) => {
    const [departments, setDepartments] = useState([]);
    const [cities, setCities] = useState([]);
    const [departmentId, setDepartmentId] = useState('');
    const [city, setCity] = useState('');

    useEffect(() => {
        getDepartments().then(setDepartments);
    }, []);

    const handleDepartmentChange = async (e) => {
        const id = e.target.value;
        setDepartmentId(id);
        setCity('');

        const selectedDep = departments.find(dep => dep.id === parseInt(id));
        const citiesData = await getCitiesDepartments(id);
        setCities(citiesData);

        onChange({
            departamento: selectedDep?.name || '',
            ciudad: '',
        });
    };

    const handleCityChange = (e) => {
        const cityName = e.target.value;
        setCity(cityName);

        onChange({
            departamento: departments.find(dep => dep.id === parseInt(departmentId))?.name || '',
            ciudad: cityName,
        });
    };


    return (
        <>
            <div className='input-group'>
                <FaMapLocationDot className='input-icon' />
                <select
                    className='select-order-group'
                    onChange={handleDepartmentChange}
                    value={departmentId}
                >
                    <option value="">Selecciona un departamento</option>
                    {departments.map(dep => (
                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                    ))}
                </select>
            </div>

            <div className='input-group'>
                <FaCity className='input-icon' />
                <select
                    className='select-order-group'
                    onChange={handleCityChange}
                    value={city}
                    disabled={cities.length === 0}
                >
                    <option value="">Selecciona una ciudad</option>
                    {cities.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default DepartamentCitySelect;