package data;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Named;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Named
@SessionScoped
public class PointBean implements Serializable {
    private static final String persistenceUnit = "Point";

    private Point result;
    private List<Point> results;

    private EntityManager entityManager;
    private EntityTransaction transaction;

    public PointBean() {
        result = new Point();
        results = new ArrayList<>();

        connection();
        loadPoints();
    }

    private void connection() {
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory(persistenceUnit);
        entityManager = entityManagerFactory.createEntityManager();
        transaction = entityManager.getTransaction();
    }

    private void loadPoints() {
        try {
            transaction.begin();
            TypedQuery<Point> query = entityManager.createQuery("select r from Point r", Point.class);
            results = query.getResultList();
            transaction.commit();
        } catch (RuntimeException exception) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw exception;
        }

    }

    public String addPoint() {
        try {
            transaction.begin();
            result.checkHit();
            entityManager.persist(result);
            results.add(result);
            result = new Point();
            transaction.commit();
        } catch (Exception exception) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw exception;
        }
        return "redirect";
    }

    public String clearPoints() {
        try {
            transaction.begin();
            Query query = entityManager.createQuery("DELETE FROM Point");
            query.executeUpdate();
            results.clear();
            transaction.commit();
        } catch (RuntimeException exception) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw exception;
        }
        return "redirect";
    }

    public Point getResult() {
        return result;
    }

    public void setResult(Point point) {
        this.result = point;
    }

    public List<Point> getResults() {
        return results;
    }

    public void setResults(List<Point> points) {
        this.results = points;
    }
}
