import { Badge } from "antd";

export const getFilterText = (selectedFilters: Array<any>) => {
  return (
    <span>
      store-{selectedFilters[0].id}
      {selectedFilters.length > 1 ? (
        <>
          &nbsp;&nbsp;
          <Badge
            count={`+${selectedFilters.length - 1}`}
            className={`site-badge-count-${selectedFilters.length - 1}`}
            style={{ backgroundColor: "#2251ff" }}
          />
        </>
      ) : (
        ""
      )}
    </span>
  );
};

export const modifySkuData = (skufixData:any) => {
  const rows:any = [];
  const allSkuEANs = Object.keys(skufixData.allSku);
  allSkuEANs.forEach((skuEAN:string, index:number) => {
    rows.push({
      key: skuEAN,
      sno: index + 1,
      ean: skuEAN,
      desc: skufixData.allSku[skuEAN].desc,
      avaiabilityStatus: skufixData.allSku[skuEAN].avaiabilityStatus,
      rootCause: skufixData.allSku[skuEAN].rootCause?.desc,
      dueDate: skufixData.allSku[skuEAN].dueDate,
      status: skufixData.allSku[skuEAN].status,
      comment: skufixData.allSku[skuEAN].comment,
      image: skufixData.allSku[skuEAN].image,
    });
  });
  return rows;
};
