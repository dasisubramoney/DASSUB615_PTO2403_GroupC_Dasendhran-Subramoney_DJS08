import React from "react"
import { Link, useSearchParams } from "react-router-dom"
import { getVans } from "../../api"

//Question 3 
// Search parameters are a way to pass data via the URL without affecting the app's route structure. 
// The useSearchParams hook allows you to read and update these parameters by making it useful for filtering content in real-time.

export default function Vans() {
    // Manage search parameters for filtering vans
    const [searchParams, setSearchParams] = useSearchParams()
    
    // State to store fetched vans data
    const [vans, setVans] = React.useState([])
    
    // Loading and error states for handling API requests
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    // Extract filter type from URL search parameters
    const typeFilter = searchParams.get("type")

    // Fetch vans data on component mount
    React.useEffect(() => {
        async function loadVans() {
            setLoading(true) // Start loading state
            try {
                const data = await getVans() // Fetch vans data
                setVans(data) // Store data in state
            } catch (err) {
                setError(err) // Store error if request fails
            } finally {
                setLoading(false) // Stop loading state
            }
        }
        
        loadVans()
    }, [])

    // Filter vans based on the selected type
    const displayedVans = typeFilter
        ? vans.filter(van => van.type === typeFilter)
        : vans

    
    const vanElements = displayedVans.map(van => (
        <div key={van.id} className="van-tile">
            <Link 
                to={van.id} 
                state={{ 
                    search: `?${searchParams.toString()}`, // Preserve search state
                    type: typeFilter 
                }}
            >
                <img src={van.imageUrl} alt={van.name} />
                <div className="van-info">
                    <h3>{van.name}</h3>
                    <p>${van.price}<span>/day</span></p>
                </div>
                <i className={`van-type ${van.type} selected`}>{van.type}</i>
            </Link>
        </div>
    ))

    // Function to update filter in URL parameters
    function handleFilterChange(key, value) {
        setSearchParams(prevParams => {
            if (value === null) {
                prevParams.delete(key) // Remove filter if value is null
            } else {
                prevParams.set(key, value) // Set new filter value
            }
            return prevParams
        })
    }

    // Display loading state
    if (loading) {
        return <h1 aria-live="polite">Loading...</h1>
    }
    
    // Display error state if API request fails
    if (error) {
        return <h1 aria-live="assertive">There was an error: {error.message}</h1>
    }

    return (
        <div className="van-list-container">
            <h1>Explore our van options</h1>
            
            {/* Filter buttons for van types */}
            <div className="van-list-filter-buttons">
                <button
                    onClick={() => handleFilterChange("type", "simple")}
                    className={
                        `van-type simple ${typeFilter === "simple" ? "selected" : ""}`
                    }
                >Simple</button>
                <button
                    onClick={() => handleFilterChange("type", "luxury")}
                    className={
                        `van-type luxury ${typeFilter === "luxury" ? "selected" : ""}`
                    }
                >Luxury</button>
                <button
                    onClick={() => handleFilterChange("type", "rugged")}
                    className={
                        `van-type rugged ${typeFilter === "rugged" ? "selected" : ""}`
                    }
                >Rugged</button>

                {/* Button to clear filters if any filter is applied */}
                {typeFilter ? (
                    <button
                        onClick={() => handleFilterChange("type", null)}
                        className="van-type clear-filters"
                    >Clear filter</button>
                ) : null}
            </div>
            
            {/* Display filtered van list */}
            <div className="van-list">
                {vanElements}
            </div>
        </div>
    )
}
