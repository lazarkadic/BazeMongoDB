package rs.devlabs.slozna.zgrada.data;

import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;


public class Debt implements Serializable {

    @Id
    private String id;
    private int electricity;
    private int water;
    private int unitedBills;
    private int buildingBills;
    private int other;
    @Indexed(unique = true)
    private String userId;

    public Debt() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getElectricity() {
        return electricity;
    }

    public void setElectricity(int electricity) {
        this.electricity = electricity;
    }

    public int getWater() {
        return water;
    }

    public void setWater(int water) {
        this.water = water;
    }

    public int getUnitedBills() {
        return unitedBills;
    }

    public void setUnitedBills(int unitedBills) {
        this.unitedBills = unitedBills;
    }

    public int getBuildingBills() {
        return buildingBills;
    }

    public void setBuildingBills(int buildingBills) {
        this.buildingBills = buildingBills;
    }

    public int getOther() {
        return other;
    }

    public void setOther(int other) {
        this.other = other;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
