import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;

public class SteigungsLabor extends JFrame {

    public SteigungsLabor() {
        setTitle("Lineare Funktionen Labor - Komplettanalyse");
        setExtendedState(JFrame.MAXIMIZED_BOTH);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        add(new PlotPanel());
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new SteigungsLabor().setVisible(true));
    }

    class PlotPanel extends JPanel {
        private double m = 1.0, n = 2.0;
        private double triX = 1.0, triSize = 2.0;
        private int dragMode = 0;
        private double scale = 50.0;

        public PlotPanel() {
            setFocusable(true);
            setBackground(Color.WHITE);
            MouseAdapter ma = new MouseAdapter() {
                public void mousePressed(MouseEvent e) {
                    double mathX = (e.getX() - getWidth() / 2.0) / scale;
                    double mathY = (getHeight() / 2.0 - e.getY()) / scale;
                    if (e.getPoint().distance(new Point((int)(getWidth()/2.0 + 5.0*scale), (int)(getHeight()/2.0 - (m*5.0+n)*scale))) < 15) dragMode = 2;
                    else if (Math.abs(mathY - (m * mathX + n)) < 0.4) dragMode = 1;
                }
                public void mouseReleased(MouseEvent e) { dragMode = 0; }
                public void mouseDragged(MouseEvent e) {
                    double mathX = (e.getX() - getWidth() / 2.0) / scale;
                    double mathY = (getHeight() / 2.0 - e.getY()) / scale;
                    if (dragMode == 1) n = mathY - m * mathX;
                    else if (dragMode == 2) m = (mathY - n) / 5.0;
                    repaint();
                }
            };
            addMouseListener(ma); addMouseMotionListener(ma);
            addKeyListener(new KeyAdapter() {
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_UP) triSize += 0.1;
                    if (e.getKeyCode() == KeyEvent.VK_DOWN && triSize > 0.2) triSize -= 0.1;
                    if (e.getKeyCode() == KeyEvent.VK_LEFT) triX -= 0.1;
                    if (e.getKeyCode() == KeyEvent.VK_RIGHT) triX += 0.1;
                    repaint();
                }
            });
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            int w = getWidth(), h = getHeight(), midX = w / 2, midY = h / 2;

            // Raster & Achsen
            g2.setColor(new Color(235, 235, 235));
            for(int i = -30; i <= 30; i++) {
                g2.draw(new Line2D.Double(0, midY - i*scale, w, midY - i*scale));
                g2.draw(new Line2D.Double(midX + i*scale, 0, midX + i*scale, h));
            }
            g2.setColor(Color.BLACK); g2.setStroke(new BasicStroke(2));
            g2.draw(new Line2D.Double(0, midY, w, midY)); g2.draw(new Line2D.Double(midX, 0, midX, h));

            // Gerade
            g2.setColor(new Color(0, 100, 250)); g2.setStroke(new BasicStroke(3));
            double xL = -midX / scale, xR = midX / scale;
            g2.draw(new Line2D.Double(midX + xL*scale, midY - (m*xL+n)*scale, midX + xR*scale, midY - (m*xR+n)*scale));

            // Steigungsdreieck
            double xA = triX, yA = m * xA + n, xB = triX + triSize, yC = m * xB + n;
            Path2D.Double triangle = new Path2D.Double();
            triangle.moveTo(midX + xA*scale, midY - yA*scale); triangle.lineTo(midX + xB*scale, midY - yA*scale); triangle.lineTo(midX + xB*scale, midY - yC*scale);
            g2.setColor(new Color(255, 120, 0, 40)); g2.fill(triangle);
            g2.setColor(new Color(255, 100, 0)); g2.setStroke(new BasicStroke(2, 1, 1, 0, new float[]{5}, 0)); g2.draw(triangle);
            g2.setFont(new Font("SansSerif", Font.BOLD, 14));
            g2.drawString(String.format("\u0394x=%.1f", triSize), (int)(midX+(xA+triSize/2)*scale-25), (int)(midY-yA*scale+20));
            g2.drawString(String.format("\u0394y=%.1f", yC-yA), (int)(midX+xB*scale+10), (int)(midY-(yA+(yC-yA)/2)*scale));

            // Achsenpunkte & Labels
            g2.setFont(new Font("SansSerif", Font.BOLD, 15));
            // n Label
            int nYPix = (int)(midY - n * scale);
            g2.setColor(new Color(180, 0, 0)); g2.fill(new Ellipse2D.Double(midX - 5, nYPix - 5, 10, 10));
            drawTextWithOutline(g2, String.format("n = %.2f", n), midX - 70, nYPix - 10, new Color(180, 0, 0));

            // x0 Label
            double x0 = (Math.abs(m) > 0.001) ? -n/m : Double.NaN;
            if (!Double.isNaN(x0)) {
                int x0Pix = (int)(midX + x0 * scale);
                g2.setColor(new Color(0, 130, 0)); g2.fill(new Ellipse2D.Double(x0Pix - 5, midY - 5, 10, 10));
                drawTextWithOutline(g2, String.format("x\u2080 = %.2f", x0), x0Pix - 25, midY + 30, new Color(0, 130, 0));
            }

            // Griff m
            g2.setColor(new Color(218, 165, 32)); g2.fill(new Ellipse2D.Double(midX + 5*scale - 8, midY - (m*5+n)*scale - 8, 16, 16));

            // UI Boxes
            drawRoundedBox(g2, "m", String.format(" = %.2f", m), 50, 50, new Color(0, 100, 250), 160, false);
            drawRoundedBox(g2, "n", String.format(" = %.2f", n), 220, 50, new Color(180, 0, 0), 160, false);
            drawRoundedBox(g2, "x", String.format(" = %.2f", x0), 390, 50, new Color(0, 130, 0), 170, true);
            drawFunctionBox(g2, 575, 50, 320, m, n);

            g2.setFont(new Font("SansSerif", Font.ITALIC, 16)); g2.setColor(Color.DARK_GRAY);
            g2.drawString("m = \u0394y / \u0394x", 80, 125);
        }

        private void drawTextWithOutline(Graphics2D g2, String text, int x, int y, Color c) {
            g2.setColor(new Color(255,255,255,200));
            g2.drawString(text, x-1, y-1); g2.drawString(text, x+1, y-1);
            g2.drawString(text, x-1, y+1); g2.drawString(text, x+1, y+1);
            g2.setColor(c);
            g2.drawString(text, x, y);
        }

        private void drawRoundedBox(Graphics2D g2, String label, String val, int x, int y, Color c, int bw, boolean subscript) {
            g2.setColor(new Color(255, 255, 255, 240)); g2.fillRoundRect(x, y, bw, 50, 15, 15);
            g2.setColor(c); g2.setStroke(new BasicStroke(3)); g2.drawRoundRect(x, y, bw, 50, 15, 15);
            g2.setFont(new Font("SansSerif", Font.BOLD, 20));
            int startX = x + 20;
            g2.drawString(label, startX, y + 33);
            if (subscript) { g2.setFont(new Font("SansSerif", Font.BOLD, 12)); g2.drawString("0", startX + 13, y + 38); }
            g2.setFont(new Font("SansSerif", Font.BOLD, 20));
            g2.drawString(val, startX + (subscript ? 22 : 15), y + 33);
        }

        private void drawFunctionBox(Graphics2D g2, int x, int y, int bw, double m, double n) {
            g2.setColor(new Color(255, 255, 255, 240)); g2.fillRoundRect(x, y, bw, 50, 15, 15);
            g2.setColor(Color.BLACK); g2.setStroke(new BasicStroke(3)); g2.drawRoundRect(x, y, bw, 50, 15, 15);
            g2.setFont(new Font("SansSerif", Font.BOLD, 22));
            String sign = n >= 0 ? "+" : "-";
            String mStr = String.format("%.2f", m), nStr = String.format("%.2f", Math.abs(n));
            int curX = x + 30;
            g2.setColor(Color.BLACK); g2.drawString("y = ", curX, y + 33); curX += 40;
            g2.setColor(new Color(0, 100, 250)); g2.drawString(mStr, curX, y + 33); curX += g2.getFontMetrics().stringWidth(mStr) + 5;
            g2.setColor(Color.BLACK); g2.drawString("x " + sign + " ", curX, y + 33); curX += g2.getFontMetrics().stringWidth("x " + sign + " ");
            g2.setColor(new Color(180, 0, 0)); g2.drawString(nStr, curX, y + 33);
        }
    }
}