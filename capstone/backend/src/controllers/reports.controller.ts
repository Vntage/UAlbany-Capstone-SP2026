import { Request, Response } from "express"
import pool from "../config/db"
import { BusinessParams } from "../types/common.type"
import { ReportService, PDFReportService } from "../middleware/report"


export const previewReport = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;
    const { reportType, startDate, endDate, periodType = "month" } = req.body;

    if(!reportType || !startDate || !endDate || (periodType !== "day" && periodType !== "month" && periodType !== "year")){
        return res.status(400).json({ message: "Missing Fields" })
    }

    const reportService = new ReportService();

    try{
        const data = await reportService.generateReport({
            reportType,
            startDate,
            endDate,
            periodType,
            businessID
        });

        res.status(200).json({
            reportType,
            data
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

export const exportReport = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;
    const { reportType, startDate, endDate, periodType = "month" } = req.body;

    if(!reportType || !startDate || !endDate || (periodType !== "day" && periodType !== "month" && periodType !== "year")){
        return res.status(400).json({ message: "Missing Fields" })
    }

    const reportService = new ReportService();
    const pdfReportService = new PDFReportService();

    try{
        const reportData = await reportService.generateReport({
            reportType,
            startDate,
            endDate,
            periodType,
            businessID
        });

        const pdfBuffer = await pdfReportService.generatePDF(
            reportType, 
            {...reportData, 
                periodType, 
                dateRange: {start: startDate, end: endDate}
            });
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${reportType}-${Date.now()}.pdf`);

        res.status(200).send(pdfBuffer);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}