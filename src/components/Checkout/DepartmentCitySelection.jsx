import { useEffect, useState } from 'react';
import { FaCity } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { getCitiesDepartments, getDepartments } from '../../api/Colombia';
import './DepartmentCitySelection.css';

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
        <div className="select-wrapper">
            <div className="input-group with-label">
                <label>Departamento</label>
                <div className="input-wrapper">
                    <FaMapLocationDot className="input-icon" />
                    <select
                        className="styled-select"
                        onChange={handleDepartmentChange}
                        value={departmentId}
                    >
                        <option value="">Selecciona un departamento</option>
                        {departments.map(dep => (
                            <option key={dep.id} value={dep.id}>{dep.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="input-group with-label">
                <label>Ciudad</label>
                <div className="input-wrapper">
                    <FaCity className="input-icon" />
                    <select
                        className="styled-select"
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
            </div>
        </div>
    );
};

export default DepartamentCitySelect;
