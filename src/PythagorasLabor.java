import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;

public class PythagorasLabor extends JPanel {

    private double a_px = 120;
    private double b_px = 180;
    private final int ox = 350, oy = 450;
    private String mode = "Quadrat";
    private int dragTarget = 0;

    private final Color colA = new Color(214, 48, 49);
    private final Color colB = new Color(9, 132, 227);
    private final Color colC = new Color(108, 92, 231);

    public PythagorasLabor() {
        setBackground(new Color(240, 242, 245));

        addMouseListener(new MouseAdapter() {
            public void mousePressed(MouseEvent e) {
                if (Point2D.distance(e.getX(), e.getY(), ox, oy - a_px) < 25) dragTarget = 1;
                else if (Point2D.distance(e.getX(), e.getY(), ox + b_px, oy) < 25) dragTarget = 2;
            }
            public void mouseReleased(MouseEvent e) { dragTarget = 0; }
        });

        addMouseMotionListener(new MouseMotionAdapter() {
            public void mouseDragged(MouseEvent e) {
                if (dragTarget == 1) a_px = Math.max(30, Math.min(300, oy - e.getY()));
                if (dragTarget == 2) b_px = Math.max(30, Math.min(400, e.getX() - ox));
                repaint();
            }
        });
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        Point2D pA = new Point2D.Double(ox, oy - a_px);
        Point2D pB = new Point2D.Double(ox + b_px, oy);
        Point2D pC = new Point2D.Double(ox, oy);

        // 1. Figuren zeichnen
        drawShape(g2, pA, pC, new Color(colA.getRed(), colA.getGreen(), colA.getBlue(), 80));
        drawShape(g2, pC, pB, new Color(colB.getRed(), colB.getGreen(), colB.getBlue(), 80));
        drawShape(g2, pB, pA, new Color(colC.getRed(), colC.getGreen(), colC.getBlue(), 80));

        // 2. Hauptdreieck
        g2.setColor(Color.WHITE);
        Path2D triangle = new Path2D.Double();
        triangle.moveTo(pC.getX(), pC.getY()); triangle.lineTo(pA.getX(), pA.getY()); triangle.lineTo(pB.getX(), pB.getY()); triangle.closePath();
        g2.fill(triangle);
        g2.setColor(new Color(45, 52, 54));
        g2.setStroke(new BasicStroke(3));
        g2.draw(triangle);
        g2.drawRect(ox, oy - 15, 15, 15);

        drawUI(g2);

        // Ziehpunkte
        g2.setColor(colA); g2.fill(new Ellipse2D.Double(pA.getX()-12, pA.getY()-12, 24, 24));
        g2.setColor(colB); g2.fill(new Ellipse2D.Double(pB.getX()-12, pB.getY()-12, 24, 24));
    }

    private void drawShape(Graphics2D g2, Point2D pS, Point2D pE, Color color) {
        g2.setColor(color);
        double dx = pE.getX() - pS.getX();
        double dy = pE.getY() - pS.getY();
        double dist = Math.sqrt(dx*dx + dy*dy);
        double nx = -dy / dist; // Vektor nach außen
        double ny = dx / dist;

        Path2D path = new Path2D.Double();
        path.moveTo(pS.getX(), pS.getY());

        if (mode.equals("Quadrat")) {
            path.lineTo(pE.getX(), pE.getY());
            path.lineTo(pE.getX() + nx * dist, pE.getY() + ny * dist);
            path.lineTo(pS.getX() + nx * dist, pS.getY() + ny * dist);
        } else if (mode.equals("Dreieck")) {
            double h = (dist * Math.sqrt(3)) / 2.0;
            path.lineTo(pE.getX(), pE.getY());
            path.lineTo((pS.getX() + pE.getX())/2.0 + nx * h, (pS.getY() + pE.getY())/2.0 + ny * h);
        } else if (mode.equals("Halbkreis") || mode.equals("Pacman")) {
            double centerX = (pS.getX() + pE.getX()) / 2.0;
            double centerY = (pS.getY() + pE.getY()) / 2.0;
            double angleBase = Math.atan2(dy, dx);

            int resolution = 50;
            double startAngle = (mode.equals("Pacman")) ? 0.4 : 0;
            double endAngle = (mode.equals("Pacman")) ? Math.PI - 0.4 : Math.PI;

            for(int i = 0; i <= resolution; i++) {
                double t = i / (double)resolution;
                double currentAngle = angleBase + startAngle + t * (endAngle - startAngle);
                // Wir zeichnen den Bogen relativ zur Basislinie
                path.lineTo(centerX - Math.sin(currentAngle) * (dist/2.0),
                        centerY + Math.cos(currentAngle) * (dist/2.0));
            }
            if (mode.equals("Pacman")) path.lineTo(centerX, centerY);
        } else if (mode.equals("Stern")) {
            for(int i = 1; i < 10; i++) {
                double t = i / 10.0;
                double h = (i % 2 == 0) ? (dist * 0.2) : (dist * 0.7);
                if (i == 5) h *= 1.2;
                path.lineTo(pS.getX() + t * dx + nx * h, pS.getY() + t * dy + ny * h);
            }
            path.lineTo(pE.getX(), pE.getY());
        }
        path.closePath();
        g2.fill(path);
    }

    private void drawUI(Graphics2D g2) {
        double valA = Math.round(a_px / 10.0);
        double valB = Math.round(b_px / 10.0);
        double factor = 1.0;
        if(mode.equals("Halbkreis")) factor = Math.PI / 8.0;
        if(mode.equals("Dreieck")) factor = Math.sqrt(3) / 4.0;
        if(mode.equals("Stern")) factor = 0.45;
        if(mode.equals("Pacman")) factor = 0.31;

        double areaA = factor * valA * valA;
        double areaB = factor * valB * valB;
        double areaSum = areaA + areaB;

        g2.setColor(Color.WHITE);
        g2.fillRoundRect(50, 30, 320, 90, 15, 15);
        g2.fillRoundRect(400, 30, 320, 90, 15, 15);
        g2.setColor(new Color(200, 200, 200));
        g2.drawRoundRect(50, 30, 320, 90, 15, 15);
        g2.drawRoundRect(400, 30, 320, 90, 15, 15);

        g2.setFont(new Font("Segoe UI", Font.BOLD, 22));
        g2.setColor(colA); g2.drawString(String.format("%.1f", areaA), 75, 85);
        g2.setColor(Color.BLACK); g2.drawString(" + ", 145, 85);
        g2.setColor(colB); g2.drawString(String.format("%.1f", areaB), 185, 85);
        g2.setColor(Color.BLACK); g2.drawString(" = ", 255, 85);
        g2.setColor(colC); g2.drawString(String.format("%.1f", areaSum), 290, 85);

        g2.setColor(colC);
        g2.drawString(String.format("Check A₃ = %.1f", areaSum), 430, 85);
    }

    public static void main(String[] args) {
        JFrame f = new JFrame("docalvers Ultra Pythagoras Labor");
        PythagorasLabor labor = new PythagorasLabor();
        f.add(labor);
        JPanel p = new JPanel();
        String[] m = {"Quadrat", "Halbkreis", "Dreieck", "Stern", "Pacman"};
        JComboBox<String> box = new JComboBox<>(m);
        box.addActionListener(e -> { labor.mode = (String)box.getSelectedItem(); labor.repaint(); });
        p.add(new JLabel("Figur: ")); p.add(box);
        f.add(p, BorderLayout.SOUTH);
        f.setSize(900, 850);
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setLocationRelativeTo(null);
        f.setVisible(true);
    }
}