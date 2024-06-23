// import React, { useState, useEffect } from "react";
// import WordItem from "./WordItem";
// import { getDatabase, ref, set, onValue, remove } from "firebase/database";
// import { auth } from '../GoogleSingin/config';


// const databaseURL = "https://jini-c66ca-default-rtdb.firebaseio.com";

// function WordBoard(props) {
//     const db = getDatabase();
//     const user = auth.currentUser;
//     const userId = user ? user.uid : null;

//     // const url = `${databaseURL}/Voca/${userId}.json`;
//     // console.log("Fetching data from:", url);

//     useEffect(() => {
//         fetch(`${databaseURL}/Voca/${userId}.json`).then(res => {
//             if (res.status !== 200) {
//                 throw new Error(res.statusText);
//             }
//             return res.json();
//         })
//     }, []);


//     const [selectedItems, setSelectedItems] = useState([]);

//     const toggleCheckbox = (index) => {
//         if (selectedItems.includes(index)) {
//             setSelectedItems(selectedItems.filter(item => item !== index));
//         } else {
//             setSelectedItems([...selectedItems, index]);
//         }
//     };

//     const handleDelete = () => {
//         if (selectedItems.length === 0) return; // No items selected

//         // Show confirmation popup
//         const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
//         if (confirmDelete) {
//             const updatedList = props.wordList.filter((item, index) => !selectedItems.includes(index));
//             props.setWordList(updatedList);
//             setSelectedItems([]);

//             // Update IDs in Firebase database
//             if (props.wordList.length > updatedList.length) {
//                 updatedList.forEach((item, index) => {
//                     const newItem = { ...item, id: index.toString() };
//                     props.setWordList((prevList) => prevList.map((word, idx) => (idx === index ? newItem : word)));
//                 });
//             }
//         }
//     };

//     return (
//         <div>
//             <button style={{ marginTop: '20px' }} onClick={handleDelete}>삭제</button>
//             {props.wordList.map((item, index) => (
//                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }} key={index}>
//                     <input
//                         type="checkbox"
//                         style={{ marginRight: '10px' }}
//                         checked={selectedItems.includes(index)}
//                         onChange={() => toggleCheckbox(index)}
//                     />
//                     <WordItem item={item} />
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default WordBoard;