export default function getHeaderCsv(cols: any) {
    return cols.map((d: any) => {
        return {
            label: d.Header,
            key: d.accessor,
        };
    });
};
