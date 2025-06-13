def normalize_param(value, param):
    if value is None:
        return 0
    if param == "Dissolved Oxygen":
        return min(100, max(0, value * 10))
    elif param == "pH_combined":
        return max(0, 100 - abs(value - 7) * 15)
    elif param == "Conductivity_combined":
        return max(0, 100 - (value - 150) * 0.1)
    elif param == "Turbidity":
        return max(0, 100 - value * 5)
    elif param == "Bio-Chemical Oxygen Demand (mg/L)":
        return max(0, 100 - value * 10)
    elif param == "Nitrate (mg/ L)":
        return max(0, 100 - value * 10)
    elif param == "Temperature":
        return max(0, 100 - abs(value - 20) * 2)
    elif param == "Faecal Coliform (MPN/ 100 mL)":
        return max(0, 100 - value * 2)
    elif param == "Solids":
        return max(0, 100 - abs(value) * 2)
    return 50

def calculate_wqi(row: dict) -> dict:
    weights = {
        "Dissolved Oxygen": 0.2,
        "pH_combined": 0.1,
        "Conductivity_combined": 0.1,
        "Turbidity": 0.1,
        "Bio-Chemical Oxygen Demand (mg/L)": 0.15,
        "Nitrate (mg/ L)": 0.15,
        "Temperature": 0.05,
        "Faecal Coliform (MPN/ 100 mL)": 0.1,
        "Solids": 0.05
    }

    total_score = 0
    for param, weight in weights.items():
        total_score += normalize_param(row.get(param), param) * weight

    if total_score >= 90:
        quality = "Excellent"
    elif total_score >= 70:
        quality = "Good"
    elif total_score >= 50:
        quality = "Fair"
    elif total_score >= 25:
        quality = "Poor"
    else:
        quality = "Very Poor"

    return {"WQI": total_score, "classification": quality}
