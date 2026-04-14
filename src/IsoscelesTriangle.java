import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;

public class IsoscelesTriangle extends JFrame {

    public IsoscelesTriangle() {
        setTitle("Gleichschenkliges Dreieck (Weißer Hintergrund)");
        setSize(600, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        add(new TrianglePanel());
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new IsoscelesTriangle().setVisible(true));
    }

    class TrianglePanel extends JPanel {
        private double umfang = 800.0; // Konstanter Umfang
        private double basis = 200.0;  // Startwert Basis
        private final double SCHRITT = 5.0;

        public TrianglePanel() {
            setFocusable(true);
            // Hintergrund auf WEISS setzen
            setBackground(Color.WHITE);

            addKeyListener(new KeyAdapter() {
                @Override
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_UP) {
                        if (basis < umfang / 2 - SCHRITT) {
                            basis += SCHRITT;
                        }
                    } else if (e.getKeyCode() == KeyEvent.VK_DOWN) {
                        if (basis > SCHRITT * 2) {
                            basis -= SCHRITT;
                        }
                    }
                    repaint();
                }
            });
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            int cx = getWidth() / 2;
            int cy = getHeight() / 2;

            // Berechnung: s = (U - b) / 2
            double schenkel = (umfang - basis) / 2.0;
            // Höhe: h = sqrt(s² - (b/2)²)
            double h = Math.sqrt(Math.pow(schenkel, 2) - Math.pow(basis / 2.0, 2));

            // Punkte berechnen
            Point2D pSpitze = new Point2D.Double(cx, cy - h / 2.0);
            Point2D pLinks = new Point2D.Double(cx - basis / 2.0, cy + h / 2.0);
            Point2D pRechts = new Point2D.Double(cx + basis / 2.0, cy + h / 2.0);

            // 1. Schenkel zeichnen (Dunkelblau für besseren Kontrast auf Weiß)
            g2.setStroke(new BasicStroke(4f));
            g2.setColor(new Color(0, 50, 200));
            g2.draw(new Line2D.Double(pLinks, pSpitze));
            g2.draw(new Line2D.Double(pRechts, pSpitze));

            // 2. Basis zeichnen (Kräftiges Rot)
            g2.setColor(new Color(220, 0, 0));
            g2.draw(new Line2D.Double(pLinks, pRechts));

            // Info-Texte (Schwarz/Dunkelgrau auf Weiß)
            g2.setColor(Color.BLACK);
            g2.setFont(new Font("SansSerif", Font.BOLD, 14));
            g2.drawString("Steuerung: Pfeiltasten HOCH / RUNTER", 20, 30);

            g2.setFont(new Font("Monospaced", Font.PLAIN, 12));
            g2.setColor(new Color(60, 60, 60));
            g2.drawString(String.format("Umfang (fix): %.1f", umfang), 20, 60);
            g2.drawString(String.format("Basis (rot):  %.1f", basis), 20, 80);
            g2.drawString(String.format("Schenkel(bl): %.1f", schenkel), 20, 100);
            g2.drawString(String.format("Höhe:         %.1f", h), 20, 120);
        }
    }
}