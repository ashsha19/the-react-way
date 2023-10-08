
// function test() {
//     return <RWFetch endpoint="https://server/api/users" method="get" updateOn={requestParams}>
//         <RWIterate till={(data, index) => true}>
//             <RWIf condition={(data, index) => true}>
//                 <div>
//                     <p>
//                         <RWData field="firstName"
//                             select={(data: any[], index) => data[index].firstName + data[index].lastName} />
//                     </p>
//                 </div>

//                 <RWElse>
//                     <div>
//                         <p><RWData field="lastName" /></p>
//                     </div>
//                 </RWElse>

//                 <RWComponent
//                     component={<input type="text" />}
//                     value={(data, i) => { }} />
//             </RWIf>

//             <div>
//                 <RWComponent
//                     component={<button>Edit</button>}
//                     onClick={(event, data) => { }} />

//                 <button>Delete</button>
//             </div>
//         </RWIterate>
//     </RWFetch>;
// }
