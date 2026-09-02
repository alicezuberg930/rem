package server.rem.utils;

import java.io.IOException;
import java.io.OutputStream;
import java.util.function.IntUnaryOperator;

import org.apache.poi.ss.SpreadsheetVersion;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

public final class ExportExcel {
    public static final int MAX_ROWS_PER_SHEET = SpreadsheetVersion.EXCEL2007.getMaxRows();

    private static final int DEFAULT_WINDOW_SIZE = 100;

    private ExportExcel() {
    }

    public static SXSSFWorkbook createWorkbook() {
        SXSSFWorkbook workbook = new SXSSFWorkbook(DEFAULT_WINDOW_SIZE);
        workbook.setCompressTempFiles(true);
        return workbook;
    }

    public static CellStyle createHeaderStyle(Workbook workbook) {
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());

        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    public static SXSSFSheet createSheet(
            SXSSFWorkbook workbook,
            String name,
            String[] headers,
            CellStyle headerStyle,
            IntUnaryOperator columnWidth
    ) {
        SXSSFSheet sheet = workbook.createSheet(name);
        Row header = sheet.createRow(0);

        for (int columnIndex = 0; columnIndex < headers.length; columnIndex++) {
            Cell cell = header.createCell(columnIndex);
            cell.setCellValue(headers[columnIndex]);
            cell.setCellStyle(headerStyle);
            sheet.setColumnWidth(columnIndex, columnWidth.applyAsInt(columnIndex));
        }

        sheet.createFreezePane(0, 1);
        sheet.setAutoFilter(new CellRangeAddress(0, 0, 0, headers.length - 1));
        return sheet;
    }

    public static void setCellValue(Row row, int columnIndex, Object value) {
        Cell cell = row.createCell(columnIndex);
        if (value instanceof Number number) {
            cell.setCellValue(number.doubleValue());
        } else if (value instanceof Boolean booleanValue) {
            cell.setCellValue(booleanValue);
        } else if (value != null) {
            cell.setCellValue(value.toString());
        }
    }

    public static void write(SXSSFWorkbook workbook, OutputStream outputStream) throws IOException {
        workbook.write(outputStream);
        outputStream.flush();
    }
}
