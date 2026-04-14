import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.List;

public class PythagorasProof_stored extends JPanel {

    private final Point A, B, C, D;  // Innere Punkte
    private final Point a, b, c, d;  // Äußere Quadrateckpunkte
    private DrawableTriangle movingTriangle;

    private final Color darkBlue = new Color(0, 0, 60);
    private final Color lightBlue = new Color(100, 150, 255, 100);

    public enum Direction {
        TOP, BOTTOM, LEFT, RIGHT
    }

    private final List<DrawableTriangle> triangles;
    private DrawableTriangle selectedTriangle = null;
    private Point dragStart = null;

    private double aLen = 100.0;
    private double sWidth = 600.0;
    private double sHeight = 400.0;
    private static double frameWidth = 1600.0;
    private double x0 = (frameWidth - sWidth) / 2.0;
    private double y0 = 200.0;

    private boolean filled = false;

    public PythagorasProof_stored() {
        a = new Point((int)x0, (int)y0);
        b = new Point((int)(x0 + sWidth), (int)y0);
        c = new Point((int)(x0 + sWidth), (int)(y0 + sWidth));
        d = new Point((int)x0, (int)(y0 + sWidth));

        A = new Point((int)(x0 + sWidth), (int)(y0 + aLen));
        B = new Point((int)(x0 + sWidth - aLen), (int)(y0 + sWidth));
        C = new Point((int)x0, (int)(y0 + sWidth - aLen));
        D = new Point((int)(x0 + aLen), (int)y0);

        triangles = new ArrayList<>();

        DrawableTriangle t1 = new DrawableTriangle((int)(x0 + aLen), (int)y0, (int)(x0 + sWidth), (int)y0, (int)(x0 + sWidth), (int)(y0 + aLen));
        DrawableTriangle t2 = new DrawableTriangle((int)(x0 + sWidth), (int)(y0 + aLen), (int)(x0 + sWidth), (int)(y0 + sWidth), (int)(x0 + sWidth - aLen), (int)(y0 + sWidth));
        DrawableTriangle t3 = new DrawableTriangle((int)(x0 + sWidth - aLen), (int)(y0 + sWidth), (int)x0, (int)(y0 + sWidth), (int)x0, (int)(y0 + sWidth - aLen));
        DrawableTriangle t4 = new DrawableTriangle((int)x0, (int)(y0 + sWidth - aLen), (int)x0, (int)y0, (int)(x0 + aLen), (int)y0);

        triangles.add(t1);
        triangles.add(t2);
        triangles.add(t3);
        triangles.add(t4);

        MouseAdapter mouseAdapter = new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                for (DrawableTriangle triangle : triangles) {
                    if (triangle.contains(e.getX(), e.getY())) {
                        selectedTriangle = triangle;
                        dragStart = new Point(e.getX(), e.getY());
                        repaint();
                        requestFocusInWindow();
                        break;
                    }
                }
            }

            @Override
            public void mouseDragged(MouseEvent e) {
                if (selectedTriangle != null && dragStart != null) {
                    double dx = e.getX() - dragStart.x;
                    double dy = e.getY() - dragStart.y;
                    selectedTriangle.translate(dx, dy);
                    dragStart = new Point(e.getX(), e.getY());
                    repaint();
                }
            }

            @Override
            public void mouseReleased(MouseEvent e) {
                dragStart = null;
            }
        };

        addMouseListener(mouseAdapter);
        addMouseMotionListener(mouseAdapter);

        setFocusable(true);
        addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_F) {
                    filled = !filled;
                    repaint();
                } else if (selectedTriangle != null) {
                    double rotationAngle = 0.0;
                    if (e.getKeyCode() == KeyEvent.VK_UP) {
                        rotationAngle = Math.toRadians(10.0);
                    } else if (e.getKeyCode() == KeyEvent.VK_DOWN) {
                        rotationAngle = Math.toRadians(-10.0);
                    }
                    if (rotationAngle != 0.0) {
                        selectedTriangle.rotate(rotationAngle, selectedTriangle.getCenter());
                        repaint();
                    }
                }
            }
        });

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                requestFocusInWindow();
                boolean clickedOnTriangle = false;
                for (DrawableTriangle triangle : triangles) {
                    if (triangle.contains(e.getX(), e.getY())) {
                        clickedOnTriangle = true;
                        break;
                    }
                }
                if (!clickedOnTriangle) {
                    selectedTriangle = null;
                    repaint();
                }
            }
        });
    }

    private double distance(Point p1, Point p2) {
        double dx = p1.x - p2.x;
        double dy = p1.y - p2.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    private double calculateArea(double x1, double y1, double x2, double y2, double x3, double y3) {
        return Math.abs((x1*(y2 - y3) + x2*(y3 - y1) + x3*(y1 - y2)) / 2.0);
    }

    private void drawSubTriangle(Graphics2D g, DrawableTriangle tri, Color outlineColor) {
        if (filled) {
            tri.draw(g, lightBlue);
            tri.drawOutline(g, outlineColor);
        } else {
            tri.drawOutline(g, outlineColor);
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;

        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, (int)frameWidth, (int)frameWidth);
        g2d.setColor(Color.BLUE);
        g2d.fillRect((int)x0, (int)y0, (int)sWidth, (int)sWidth);

        for (DrawableTriangle triangle : triangles) {
            if (triangle == selectedTriangle) {
                triangle.draw(g2d, Color.ORANGE);
                triangle.drawCornerNumbers(g2d);
            } else {
                triangle.draw(g2d, Color.RED);
            }
        }

        DrawableTriangle t0 = triangles.get(0);

        DrawableTriangle c1d = new DrawableTriangle(C.x, C.y, t0.x1, t0.y1, D.x, D.y);
        DrawableTriangle d1a = new DrawableTriangle(D.x, D.y, t0.x1, t0.y1, A.x, A.y);
        DrawableTriangle a2 = new DrawableTriangle(t0.x1, t0.y1, A.x, A.y, t0.x2, t0.y2);
        DrawableTriangle a2b = new DrawableTriangle(A.x, A.y, t0.x2, t0.y2, B.x, B.y);
        DrawableTriangle b3 = new DrawableTriangle(t0.x2, t0.y2, B.x, B.y, t0.x3, t0.y3);
        DrawableTriangle bc3 = new DrawableTriangle(B.x, B.y, C.x, C.y, t0.x3, t0.y3);
        DrawableTriangle c31 = new DrawableTriangle(C.x, C.y, t0.x3, t0.y3, t0.x1, t0.y1);
        DrawableTriangle dab = new DrawableTriangle(D.x, D.y, A.x, A.y, b.x, b.y);

        drawSubTriangle(g2d, c1d, darkBlue);
        drawSubTriangle(g2d, d1a, darkBlue);
        drawSubTriangle(g2d, a2, darkBlue);
        drawSubTriangle(g2d, a2b, darkBlue);
        drawSubTriangle(g2d, b3, darkBlue);
        drawSubTriangle(g2d, bc3, darkBlue);
        drawSubTriangle(g2d, c31, darkBlue);
        drawSubTriangle(g2d, dab, darkBlue);

        // ===== ALLE FLÄCHEN BERECHNEN (mit double) =====

        // 1. Die 8 Teildreiecke
        double area_C1D = calculateArea(C.x, C.y, t0.x1, t0.y1, D.x, D.y);
        double area_D1A = calculateArea(D.x, D.y, t0.x1, t0.y1, A.x, A.y);
        double area_1A2 = calculateArea(t0.x1, t0.y1, A.x, A.y, t0.x2, t0.y2);
        double area_A2B = calculateArea(A.x, A.y, t0.x2, t0.y2, B.x, B.y);
        double area_2B3 = calculateArea(t0.x2, t0.y2, B.x, B.y, t0.x3, t0.y3);
        double area_BC3 = calculateArea(B.x, B.y, C.x, C.y, t0.x3, t0.y3);
        double area_C31 = calculateArea(C.x, C.y, t0.x3, t0.y3, t0.x1, t0.y1);
        double area_DAa = calculateArea(D.x, D.y, A.x, A.y, b.x, b.y);

        double sum8Teilflaechen = area_C1D + area_D1A + area_1A2 + area_A2B + area_2B3 + area_BC3 + area_C31 + area_DAa;

        // 2. Das innere Quadrat ABDC (Punkte A, B, C, D)
        double innerSquareArea = distance(A, B) * distance(A, B);

        // 3. Das äußere blaue Quadrat
        double blueArea = sWidth * sWidth;

        // 4. Die 4 großen roten Dreiecke (die verschoben werden können)
        double bigTriangleArea1 = calculateArea(t0.x1, t0.y1, t0.x2, t0.y2, t0.x3, t0.y3);
        double sumBigTriangles = bigTriangleArea1 * 4.0;

        // Seitenlängen
        double lenAB = distance(A, B);
        double lenBC = distance(B, C);
        double lenCD = distance(C, D);
        double lenDA = distance(D, A);

        // ===== ANZEIGE =====
        g2d.setColor(Color.BLACK);
        int y = 20;
        int x = 10;

        g2d.setFont(new Font("Arial", Font.BOLD, 14));
        g2d.drawString("=== PYTHAGORAS BEWEIS ===", x, y); y += 22;

        // Einzelflächen der 8 Teildreiecke
        g2d.setFont(new Font("Arial", Font.BOLD, 12));
        g2d.drawString("Die 8 Teildreiecke:", x, y); y += 16;
        g2d.setFont(new Font("Monospaced", Font.PLAIN, 10));
        g2d.drawString(String.format("1. C1D  = %10.2f", area_C1D), x+10, y); y += 14;
        g2d.drawString(String.format("2. D1A  = %10.2f", area_D1A), x+10, y); y += 14;
        g2d.drawString(String.format("3. 1A2  = %10.2f", area_1A2), x+10, y); y += 14;
        g2d.drawString(String.format("4. A2B  = %10.2f", area_A2B), x+10, y); y += 14;
        g2d.drawString(String.format("5. 2B3  = %10.2f", area_2B3), x+10, y); y += 14;
        g2d.drawString(String.format("6. BC3  = %10.2f", area_BC3), x+10, y); y += 14;
        g2d.drawString(String.format("7. C31  = %10.2f", area_C31), x+10, y); y += 14;
        g2d.drawString(String.format("8. DAb  = %10.2f", area_DAa), x+10, y); y += 16;

        g2d.setFont(new Font("Arial", Font.BOLD, 11));
        g2d.drawString(String.format("SUMME 8 Teildreiecke = %10.2f", sum8Teilflaechen), x+10, y); y += 20;

        // Weitere Flächen
        g2d.setFont(new Font("Arial", Font.BOLD, 12));
        g2d.drawString("Weitere Flächen:", x, y); y += 16;
        g2d.setFont(new Font("Monospaced", Font.PLAIN, 10));
        g2d.drawString(String.format("Inneres Quadrat ABDC = %10.2f", innerSquareArea), x+10, y); y += 14;
        g2d.drawString(String.format("4 große rote Dreiecke = %10.2f", sumBigTriangles), x+10, y); y += 14;
        g2d.drawString(String.format("Äußeres blaues Quadrat = %10.2f", blueArea), x+10, y); y += 18;

        // Vergleich
        g2d.setFont(new Font("Arial", Font.BOLD, 12));
        g2d.drawString("=== VERGLEICH ===", x, y); y += 18;
        g2d.setFont(new Font("Monospaced", Font.PLAIN, 10));
        g2d.drawString(String.format("Inneres Quadrat + 4 Dreiecke = %.2f + %.2f = %.2f",
                innerSquareArea, sumBigTriangles, innerSquareArea + sumBigTriangles), x+10, y); y += 14;
        g2d.drawString(String.format("Äußeres Quadrat = %.2f", blueArea), x+10, y); y += 14;

        if (Math.abs(innerSquareArea + sumBigTriangles - blueArea) < 0.01) {
            g2d.setFont(new Font("Arial", Font.BOLD, 12));
            g2d.setColor(new Color(0, 150, 0));
            g2d.drawString("✓ BEWIESEN: (a+b)² = c² + 4×(ab/2)", x, y + 10);
            g2d.drawString("  → a² + 2ab + b² = c² + 2ab", x, y + 24);
            g2d.drawString("  → a² + b² = c²", x, y + 38);
            g2d.setColor(Color.BLACK);
        }

        // Info
        g2d.setFont(new Font("Arial", Font.PLAIN, 11));
        g2d.setColor(Color.GRAY);
        g2d.drawString("F-Taste: Füllung " + (filled ? "EIN" : "AUS"), x, 730);
        g2d.drawString("Pfeiltasten: 10° Drehung | Maus: Verschieben", x, 745);
        g2d.drawString("Klick auf leere Fläche: Deselektieren", x, 760);

        // Punkte beschriften
        g2d.setColor(darkBlue);
        drawPoint(g2d, a, "a", Direction.TOP);
        drawPoint(g2d, b, "b", Direction.TOP);
        drawPoint(g2d, c, "c", Direction.BOTTOM);
        drawPoint(g2d, d, "d", Direction.BOTTOM);
        drawPoint(g2d, A, "A", Direction.RIGHT);
        drawPoint(g2d, B, "B", Direction.BOTTOM);
        drawPoint(g2d, C, "C", Direction.LEFT);
        drawPoint(g2d, D, "D", Direction.TOP);
    }

    private void drawPoint(Graphics g, Point p, String letter, Direction direction) {
        g.fillOval(p.x - 4, p.y - 4, 8, 8);
        int offset = 16;
        switch (direction) {
            case TOP:    g.drawString(letter, p.x - 4, p.y - offset); break;
            case BOTTOM: g.drawString(letter, p.x, p.y + offset); break;
            case LEFT:   g.drawString(letter, p.x - offset - 4, p.y + 4); break;
            case RIGHT:  g.drawString(letter, p.x + offset, p.y + 4); break;
        }
    }

    public static void main(String[] args) {
        JFrame f = new JFrame();
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setSize((int)frameWidth, (int)frameWidth);
        f.setLocation(0, 0);

        PythagorasProof_stored panel = new PythagorasProof_stored();
        f.add(panel);
        f.setVisible(true);

        SwingUtilities.invokeLater(() -> {
            panel.requestFocusInWindow();
        });
    }

    public class DrawableTriangle {
        private double x1, y1, x2, y2, x3, y3;
        private Polygon polygon;

        public DrawableTriangle(double x1, double y1, double x2, double y2, double x3, double y3) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.x3 = x3;
            this.y3 = y3;
            updatePolygon();
        }

        public DrawableTriangle(int x1, int y1, int x2, int y2, int x3, int y3) {
            this((double)x1, (double)y1, (double)x2, (double)y2, (double)x3, (double)y3);
        }

        private void updatePolygon() {
            int[] xPoints = {(int)x1, (int)x2, (int)x3};
            int[] yPoints = {(int)y1, (int)y2, (int)y3};
            polygon = new Polygon(xPoints, yPoints, 3);
        }

        public void draw(Graphics g, Color color) {
            g.setColor(color);
            g.fillPolygon(polygon);
        }

        public void drawOutline(Graphics g, Color color) {
            g.setColor(color);
            g.drawPolygon(polygon);
        }

        public void drawCornerNumbers(Graphics g) {
            g.setColor(Color.BLACK);
            g.setFont(new Font("Arial", Font.BOLD, 14));
            g.drawString("1", (int)x1 - 8, (int)y1 - 8);
            g.drawString("2", (int)x2 + 5, (int)y2 - 8);
            g.drawString("3", (int)x3 - 8, (int)y3 + 15);
        }

        public void translate(double dx, double dy) {
            x1 += dx; y1 += dy;
            x2 += dx; y2 += dy;
            x3 += dx; y3 += dy;
            updatePolygon();
        }

        public void rotate(double angleRad, Point center) {
            Point p1 = rotatePoint(new Point((int)x1, (int)y1), center, angleRad);
            Point p2 = rotatePoint(new Point((int)x2, (int)y2), center, angleRad);
            Point p3 = rotatePoint(new Point((int)x3, (int)y3), center, angleRad);
            x1 = p1.x; y1 = p1.y;
            x2 = p2.x; y2 = p2.y;
            x3 = p3.x; y3 = p3.y;
            updatePolygon();
        }

        private Point rotatePoint(Point p, Point center, double angleRad) {
            double dx = p.x - center.x;
            double dy = p.y - center.y;
            double cos = Math.cos(angleRad);
            double sin = Math.sin(angleRad);
            return new Point((int)(center.x + dx * cos - dy * sin),
                    (int)(center.y + dx * sin + dy * cos));
        }

        public Point getCenter() {
            return new Point((int)((x1 + x2 + x3) / 3.0), (int)((y1 + y2 + y3) / 3.0));
        }

        public boolean contains(int x, int y) {
            return polygon.contains(x, y);
        }
    }
}