import "../style/table.scss";

function EmptyTable({ columns } : { columns: any}) {
    return ( 
        <div className="emptyTable">
            <table>
                <thead>
                    <tr>
                        {columns.map((col : any, i : number) => (
                            <th key={i}>
                                {col.Header}
                            </th>
                        ))}
                    </tr>
                </thead>
            </table>
            <p>Belum ada data</p>
        </div>
     );
}

export default EmptyTable;