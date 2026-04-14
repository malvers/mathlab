import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;
import java.util.ArrayList;
import java.util.Random;

public class StatistikLabor extends JFrame {

    public StatistikLabor() {
        setTitle("Statistik-Labor - Den Korrelationskoeffizienten r verstehen");
        // Startet IMMER im Vollbild
        setExtendedState(JFrame.MAXIMIZED_BOTH);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        StatsPanel panel = new StatsPanel();
        add(panel);
        panel.setFocusable(true);
        panel.requestFocusInWindow();

        JLabel info = new JLabel(" [Links] Punkt/Drag | [Rechts] Reset | [R] Chaos | [UP/DOWN] Streuung | [SPACE] SD Toggle");
        info.setFont(new Font("SansSerif", Font.BOLD, 14));
        info.setBorder(BorderFactory.createEmptyBorder(10, 15, 10, 15));
        add(info, BorderLayout.SOUTH);
    }

    public static void main(String[] args) {
        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception e) {}
        SwingUtilities.invokeLater(() -> new StatistikLabor().setVisible(true));
    }

    class StatsPanel extends JPanel {
        private ArrayList<Point2D> points = new ArrayList<>();
        private Point2D selectedPoint = null;
        private double r = 0, m = 0, n_val = 0, sd_res = 0;
        private boolean showSD = true;
        private Random rnd = new Random();

        private final int OFF_X = 80;
        private final int OFF_Y = 120;
        private final double SCALE = 55.0;

        public StatsPanel() {
            setBackground(Color.WHITE);
            MouseAdapter mouseHandler = new MouseAdapter() {
                @Override
                public void mousePressed(MouseEvent e) {
                    if (SwingUtilities.isRightMouseButton(e)) {
                        points.clear();
                        updateAndRepaint();
                        return;
                    }
                    selectedPoint = null;
                    double mouseX = (e.getX() - OFF_X) / SCALE;
                    double mouseY = (getHeight() - OFF_Y - e.getY()) / SCALE;
                    for (Point2D p : points) {
                        if (p.distance(mouseX, mouseY) < 0.4) {
                            selectedPoint = p;
                            break;
                        }
                    }
                    if (selectedPoint == null) {
                        selectedPoint = new Point2D.Double(mouseX, mouseY);
                        points.add(selectedPoint);
                    }
                    updateAndRepaint();
                }
                @Override
                public void mouseReleased(MouseEvent e) { selectedPoint = null; }
                @Override
                public void mouseDragged(MouseEvent e) {
                    if (selectedPoint != null) {
                        double mouseX = (e.getX() - OFF_X) / SCALE;
                        double mouseY = (getHeight() - OFF_Y - e.getY()) / SCALE;
                        selectedPoint.setLocation(mouseX, mouseY);
                        updateAndRepaint();
                    }
                }
            };
            addMouseListener(mouseHandler);
            addMouseMotionListener(mouseHandler);

            addKeyListener(new KeyAdapter() {
                @Override
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_SPACE) showSD = !showSD;
                    if (e.getKeyCode() == KeyEvent.VK_R) generateRandomPoints();
                    if (points.size() < 2) { repaint(); return; }
                    double factor = 1.0;
                    if (e.getKeyCode() == KeyEvent.VK_UP) factor = 1.05;
                    if (e.getKeyCode() == KeyEvent.VK_DOWN) factor = 0.95;
                    if (factor != 1.0) applyScaling(factor);
                    updateAndRepaint();
                }
            });
        }

        private void generateRandomPoints() {
            points.clear();
            int count = 30 + rnd.nextInt(10);
            double baseM = (rnd.nextDouble() - 0.5) * 0.7;
            double baseN = 5 + rnd.nextDouble() * 3;
            for (int i = 0; i < count; i++) {
                double x = rnd.nextDouble() * 26.0;
                double y = baseM * x + baseN + (rnd.nextGaussian() * 1.5);
                points.add(new Point2D.Double(x, Math.max(0, y)));
            }
            updateAndRepaint();
        }

        private void applyScaling(double factor) {
            for (Point2D p : points) {
                double targetY = m * p.getX() + n_val;
                double diff = p.getY() - targetY;
                p.setLocation(p.getX(), targetY + (diff * factor));
            }
        }

        private void updateAndRepaint() {
            calculateStats();
            repaint();
            requestFocusInWindow();
        }

        private void calculateStats() {
            int n = points.size();
            if (n < 2) { r = m = n_val = sd_res = 0; return; }
            double sX=0, sY=0, sXY=0, sX2=0, sY2=0;
            for (Point2D p : points) {
                sX+=p.getX(); sY+=p.getY(); sXY+=p.getX()*p.getY();
                sX2+=p.getX()*p.getX(); sY2+=p.getY()*p.getY();
            }
            double numR = n * sXY - sX * sY;
            double denR = Math.sqrt((n * sX2 - sX * sX) * (n * sY2 - sY * sY));
            r = (denR != 0) ? numR / denR : 0;
            double denM = (n * sX2 - sX * sX);
            m = (denM != 0) ? numR / denM : 0;
            n_val = (sY / n) - m * (sX / n);
            double sumSqRes = 0;
            for (Point2D p : points) sumSqRes += Math.pow(p.getY() - (m * p.getX() + n_val), 2);
            sd_res = (n > 2) ? Math.sqrt(sumSqRes / (n - 2)) : 0;
        }

        private void drawArrow(Graphics2D g2, double x1, double y1, double x2, double y2) {
            double phi = Math.toRadians(20);
            int barb = 20;
            g2.draw(new Line2D.Double(x1, y1, x2, y2));
            double theta = Math.atan2(y2 - y1, x2 - x1);
            g2.draw(new Line2D.Double(x2, y2, x2 - barb * Math.cos(theta + phi), y2 - barb * Math.sin(theta + phi)));
            g2.draw(new Line2D.Double(x2, y2, x2 - barb * Math.cos(theta - phi), y2 - barb * Math.sin(theta - phi)));
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            int h = getHeight(), w = getWidth();

            // Gitter
            g2.setFont(new Font("SansSerif", Font.PLAIN, 12));
            for (int i = 0; i <= (w/SCALE); i++) {
                double px = OFF_X + i * SCALE;
                g2.setColor(new Color(245, 245, 245));
                if (px < w - 20) g2.draw(new Line2D.Double(px, 40, px, h - OFF_Y));
                g2.setColor(Color.LIGHT_GRAY);
                if (i % 2 == 0 && px < w - 40) g2.drawString("" + i, (int)px - 5, h - OFF_Y + 20);
            }
            for (int i = 0; i <= (h/SCALE); i++) {
                double py = h - OFF_Y - i * SCALE;
                g2.setColor(new Color(245, 245, 245));
                if (py > 40) g2.draw(new Line2D.Double(OFF_X, py, w - 40, py));
                g2.setColor(Color.LIGHT_GRAY);
                if (i % 2 == 0 && py > 40) g2.drawString("" + i, OFF_X - 30, (int)py + 5);
            }

            // Schatten & Linie
            if (showSD && points.size() >= 3 && sd_res > 0) {
                Path2D shadow = new Path2D.Double();
                double x_end = (w - OFF_X) / SCALE;
                shadow.moveTo(OFF_X, h-OFF_Y-(m*0+n_val+sd_res)*SCALE);
                shadow.lineTo(OFF_X+x_end*SCALE, h-OFF_Y-(m*x_end+n_val+sd_res)*SCALE);
                shadow.lineTo(OFF_X+x_end*SCALE, h-OFF_Y-(m*x_end+n_val-sd_res)*SCALE);
                shadow.lineTo(OFF_X, h-OFF_Y-(m*0+n_val-sd_res)*SCALE);
                shadow.closePath();
                g2.setColor(new Color(0, 110, 255, 30)); g2.fill(shadow);
            }

            g2.setColor(Color.BLACK); g2.setStroke(new BasicStroke(2.5f));
            drawArrow(g2, OFF_X, h - OFF_Y, w - 25, h - OFF_Y);
            drawArrow(g2, OFF_X, h - OFF_Y, OFF_X, 25);

            if (points.size() >= 2) {
                g2.setColor(new Color(220, 20, 60)); g2.setStroke(new BasicStroke(4.0f));
                double x_end = (w - OFF_X) / SCALE;
                g2.draw(new Line2D.Double(OFF_X, h-OFF_Y-n_val*SCALE, OFF_X+x_end*SCALE, h-OFF_Y-(m*x_end+n_val)*SCALE));
            }

            // Punkte
            for (Point2D p : points) {
                double px = OFF_X + p.getX()*SCALE, py = h - OFF_Y - p.getY()*SCALE;
                g2.setColor(p == selectedPoint ? Color.RED : new Color(0, 90, 190));
                g2.fill(new Ellipse2D.Double(px-8, py-8, 16, 16));
                g2.setColor(Color.WHITE); g2.setStroke(new BasicStroke(1.5f));
                g2.draw(new Ellipse2D.Double(px-8, py-8, 16, 16));
            }

            // Layout Dashboard & r-Box
            int dashW = 240, dashH = 190;
            int rBoxW = 320, rBoxH = 140;
            int xDash = w - 40 - dashW;
            int xRBox = xDash - rBoxW - 30; // Schön viel Platz dazwischen
            int yPos = 50;

            // Dashboard
            g2.setColor(new Color(40, 40, 40, 240));
            g2.fillRoundRect(xDash, yPos, dashW, dashH, 25, 25);
            g2.setColor(Color.WHITE); g2.setFont(new Font("Monospaced", Font.BOLD, 18));
            g2.drawString(String.format("r  = %7.4f", r), xDash + 25, yPos + 45);
            g2.drawString(String.format("m  = %7.4f", m), xDash + 25, yPos + 75);
            g2.drawString(String.format("n  = %7.4f", n_val), xDash + 25, yPos + 105);
            g2.setColor(new Color(130, 200, 255));
            g2.drawString(String.format("SD = %7.4f", sd_res), xDash + 25, yPos + 150);

            // Rote Box (Auffällig für Screen-Recordings)
            g2.setColor(new Color(220, 20, 60, 250));
            g2.fillRoundRect(xRBox, yPos, rBoxW, rBoxH, 30, 30);
            g2.setColor(Color.WHITE);
            g2.setFont(new Font("SansSerif", Font.BOLD, 22));
            g2.drawString("Korrelation (r)", xRBox + 30, yPos + 40);
            g2.setFont(new Font("Monospaced", Font.BOLD, 64));
            g2.drawString(String.format("%+.4f", r), xRBox + 30, yPos + 110);
        }
    }
}