package server.rem.utils;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class TaxCalculator {

    private static final Map<Double, Double> TAX_MAP = new LinkedHashMap<>() {
        {
            put(10_000_000.0, 0.05);
            put(30_000_000.0, 0.10);
            put(60_000_000.0, 0.20);
            put(100_000_000.0, 0.30);
            put(Double.MAX_VALUE, 0.35);
        }
    };

    public double calculate(double taxableIncome) {
        if (taxableIncome <= 0) {
            return 0;
        }
        double tax = 0;
        double previousCeiling = 0;
        for (Map.Entry<Double, Double> bracket : TAX_MAP.entrySet()) {
            double ceiling = bracket.getKey();
            double rate = bracket.getValue();
            if (taxableIncome <= previousCeiling) {
                break;
            }
            double taxableInBracket = Math.min(taxableIncome, ceiling) - previousCeiling;
            tax += taxableInBracket * rate;
            previousCeiling = ceiling;
        }
        return tax;
    }
}
