import { Col, message, Row } from "antd";
import StackedBarChart from "./chart/StackedBarChart";
const style: React.CSSProperties = { padding: '8px 0', };
const ComplienceToAllKpiChart = (props: any) => {
    const { kpisComplianceData } = props
    const osaData: any = kpisComplianceData?.["selectedCategoryComplianceToKPI's"]
    return (
        <>
            <div >
                <Row justify="space-between" gutter={[16, 24]}>
                    <Col lg={12} md={12} xs={12}>
                        <div style={style}>{'CORE OSA'}</div>
                        <div style={style}><StackedBarChart kpiComplianceData={osaData?.coreOsa} /></div>
                    </Col>
                    <Col lg={12} md={12} xs={12}>
                        <div style={style}>{'FULL OSA'}</div>
                        <div style={style}><StackedBarChart kpiComplianceData={osaData?.fullOsa} /></div>
                    </Col>
                </Row>
            </div>
        </>
    );

}
export default ComplienceToAllKpiChart;
