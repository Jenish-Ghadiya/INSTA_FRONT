import React, { useState } from "react";
import "./search.scss";
import foodProducts from "./data/data";
import { FaSearch } from "react-icons/fa";
function Search() {
    const [search, setSearch] = useState("");

    const handleOnChange = (e) => {
        setSearch(e.target.value);
    };

    const Data = foodProducts.filter(
        (product) =>
            product.name.toUpperCase().includes(search.toUpperCase()) ||
            product.category.toUpperCase().includes(search.toUpperCase())
    );
    return (
        <div className="container">
            <div className="heading">
                <h1>Search Functionality</h1>
            </div>
            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleOnChange}
                />
            </div>
            <div className="main">
                {Data.length > 0 ? (
                    Data.map((data, i) => (
                        <div key={i} className="card">
                            <div className="img"></div>
                            <h3>{data.name}</h3>
                            <h4>{data.price}</h4>
                            <h4>{data.discount}</h4>
                            <h4>{data.category}</h4>
                            <h4>{data.availability}</h4>
                        </div>
                    ))
                ) : (
                    <h1>No Data</h1>
                )}
            </div>
        </div>
    );
}

export default Search;

// import React, { useState } from "react";
// import "./search.scss";
// import foodProducts from "./data/data";
// import { FaSearch } from "react-icons/fa";

// function Search() {
//     const [search, setSearch] = useState("");

//     const handleOnChange = (e) => {
//         setSearch(e.target.value);
//     };

//     const filteredData = foodProducts.filter((product) =>
//         product.name.toUpperCase().includes(search.toUpperCase())
//     );

//     return (
//         <div className="container">
//             <div className="heading">
//                 <h1>Search Functionality</h1>
//             </div>
//             <div className="search-bar">
//                 <FaSearch className="search-icon" />
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     value={search}
//                     onChange={handleOnChange}
//                 />
//             </div>
//             <div className="main">
//                 {filteredData.length > 0 ? (
//                     filteredData.map((product, i) => (
//                         <div key={i} className="card">
//                             <div className="img"></div>
//                             <h3>{product.name}</h3>
//                             <h4>Price: ${product.price.toFixed(2)}</h4>
//                             <h4>Discount: {product.discount * 100}%</h4>
//                             <h4>Category: {product.category}</h4>
//                             <h4>Availability: {product.availability ? "In Stock" : "Out of Stock"}</h4>
//                         </div>
//                     ))
//                 ) : (
//                     <h1>No Data Found</h1>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Search;
