package secure_shop.backend.utils;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import secure_shop.backend.dto.product.BrandDTO;
import secure_shop.backend.dto.product.CategorySummaryDTO;
import secure_shop.backend.dto.product.ProductDetailsDTO;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ExcelHelper {
    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    static String SHEET = "Products";

    public static boolean hasExcelFormat(MultipartFile file) {
        return TYPE.equals(file.getContentType());
    }

    private static String getCellValueAsString(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (cell.getCellType() == CellType.NUMERIC) {
            return String.valueOf(cell.getNumericCellValue());
        }
        return null;
    }

    public static List<ProductDetailsDTO> excelToProducts(InputStream is) {
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheet(SHEET);
            if (sheet == null) {
                // Try first sheet if name doesn't match
                sheet = workbook.getSheetAt(0);
            }

            Iterator<Row> rows = sheet.iterator();
            List<ProductDetailsDTO> products = new ArrayList<>();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                // skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Iterator<Cell> cellsInRow = currentRow.iterator();
                ProductDetailsDTO product = new ProductDetailsDTO();
                int cellIdx = 0;

                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();
                    switch (cellIdx) {
                        case 0: // SKU
                            product.setSku(getCellValueAsString(currentCell));
                            break;
                        case 1: // Name
                            product.setName(getCellValueAsString(currentCell));
                            break;
                        case 2: // shortDesc
                            product.setShortDesc(getCellValueAsString(currentCell));
                            break;
                        case 3: // longDesc
                            product.setLongDesc(getCellValueAsString(currentCell));
                            break;
                        case 4: // listedPrice
                            if (currentCell.getCellType() == CellType.NUMERIC) {
                                product.setListedPrice(BigDecimal.valueOf(currentCell.getNumericCellValue()));
                            }
                            break;
                        case 5: // price
                            if (currentCell.getCellType() == CellType.NUMERIC) {
                                product.setPrice(BigDecimal.valueOf(currentCell.getNumericCellValue()));
                            }
                            break;
                        case 6: // active (1 = true, 0 = false)
                            if (currentCell.getCellType() == CellType.NUMERIC) {
                                product.setActive(currentCell.getNumericCellValue() == 1.0);
                            } else {
                                product.setActive(true);
                            }
                            break;
                        case 7: // thumbnailUrl
                            product.setThumbnailUrl(getCellValueAsString(currentCell));
                            break;
                        case 8: // categoryId
                            if (currentCell.getCellType() == CellType.NUMERIC) {
                                CategorySummaryDTO cat = new CategorySummaryDTO();
                                cat.setId((long) currentCell.getNumericCellValue());
                                product.setCategory(cat);
                            }
                            break;
                        case 9: // brandId
                            if (currentCell.getCellType() == CellType.NUMERIC) {
                                BrandDTO brand = new BrandDTO();
                                brand.setId((long) currentCell.getNumericCellValue());
                                product.setBrand(brand);
                            }
                            break;
                        case 10: // initial inventory stock
                            if (currentCell.getCellType() == CellType.NUMERIC) {
                                product.setAvailableStock((int) currentCell.getNumericCellValue());
                            }
                            break;
                        default:
                            break;
                    }
                    cellIdx++;
                }

                if (product.getActive() == null) product.setActive(true);
                if (product.getAvailableStock() == null) product.setAvailableStock(0);
                if (product.getPrice() == null && product.getListedPrice() != null) {
                    product.setPrice(product.getListedPrice());
                }

                if (product.getName() != null && !product.getName().isEmpty()) {
                    products.add(product);
                }
            }

            workbook.close();
            return products;
        } catch (Exception e) {
            throw new RuntimeException("Fail to parse Excel file: " + e.getMessage());
        }
    }
}
