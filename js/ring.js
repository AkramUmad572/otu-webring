// OTU Webring - Animated Ring Visualization
// Creates an orbital constellation effect representing the webring

class RingVisualization {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;

        // Colors matching the design
        this.colors = {
            primary: '#FF6B35',
            secondary: '#003E7E',
            accent: '#00D4FF',
            dim: 'rgba(255, 107, 53, 0.1)'
        };

        this.init();
        this.setupEvents();
        this.animate();
    }

    init() {
        this.resize();
        this.createNodes();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }

    createNodes() {
        this.nodes = [];
        const nodeCount = Math.min(40, Math.floor((this.width * this.height) / 25000));

        // Create orbital nodes
        for (let i = 0; i < nodeCount; i++) {
            const orbit = 1 + Math.floor(i / 12);
            const baseRadius = Math.min(this.width, this.height) * (0.15 + orbit * 0.12);
            const angle = (i / nodeCount) * Math.PI * 2 + (orbit * 0.5);

            this.nodes.push({
                baseAngle: angle,
                orbit: orbit,
                radius: baseRadius + (Math.random() - 0.5) * 60,
                size: Math.random() * 2.5 + 1,
                speed: (0.0002 + Math.random() * 0.0003) * (orbit % 2 === 0 ? 1 : -1),
                color: Math.random() > 0.6 ? this.colors.primary : this.colors.secondary,
                pulseOffset: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.5 + 0.3
            });
        }

        // Create floating particles
        for (let i = 0; i < 30; i++) {
            this.nodes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 1.5 + 0.5,
                color: this.colors.accent,
                opacity: Math.random() * 0.3 + 0.1,
                isFloating: true
            });
        }
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createNodes();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    drawNode(node, x, y) {
        const ctx = this.ctx;
        const pulse = Math.sin(this.time * 2 + (node.pulseOffset || 0)) * 0.3 + 1;

        ctx.beginPath();
        ctx.arc(x, y, node.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.opacity;
        ctx.fill();

        // Glow effect
        if (node.size > 1.5 && !node.isFloating) {
            ctx.beginPath();
            ctx.arc(x, y, node.size * pulse * 2.5, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, node.size * pulse * 2.5);
            gradient.addColorStop(0, node.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = node.opacity * 0.3;
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    drawConnections() {
        const ctx = this.ctx;
        const orbitalNodes = this.nodes.filter(n => !n.isFloating);

        for (let i = 0; i < orbitalNodes.length; i++) {
            const node1 = orbitalNodes[i];
            const angle1 = node1.baseAngle + this.time * node1.speed * 1000;
            const x1 = this.centerX + Math.cos(angle1) * node1.radius;
            const y1 = this.centerY + Math.sin(angle1) * node1.radius;

            // Connect to nearby nodes in same or adjacent orbit
            for (let j = i + 1; j < orbitalNodes.length; j++) {
                const node2 = orbitalNodes[j];
                if (Math.abs(node1.orbit - node2.orbit) > 1) continue;

                const angle2 = node2.baseAngle + this.time * node2.speed * 1000;
                const x2 = this.centerX + Math.cos(angle2) * node2.radius;
                const y2 = this.centerY + Math.sin(angle2) * node2.radius;

                const dx = x1 - x2;
                const dy = y1 - y2;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.strokeStyle = node1.color;
                    ctx.globalAlpha = opacity;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    drawOrbits() {
        const ctx = this.ctx;

        for (let orbit = 1; orbit <= 3; orbit++) {
            const radius = Math.min(this.width, this.height) * (0.15 + orbit * 0.12);

            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = this.colors.primary;
            ctx.globalAlpha = 0.03;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }

    update() {
        this.time += 0.016; // ~60fps

        // Update floating particles
        this.nodes.forEach(node => {
            if (node.isFloating) {
                node.x += node.vx;
                node.y += node.vy;

                // Wrap around edges
                if (node.x < 0) node.x = this.width;
                if (node.x > this.width) node.x = 0;
                if (node.y < 0) node.y = this.height;
                if (node.y > this.height) node.y = 0;

                // Subtle mouse influence
                const dx = this.mouseX - node.x;
                const dy = this.mouseY - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 200) {
                    const force = (200 - distance) / 200 * 0.01;
                    node.vx -= (dx / distance) * force;
                    node.vy -= (dy / distance) * force;
                }

                // Damping
                node.vx *= 0.99;
                node.vy *= 0.99;
            }
        });
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // Draw orbit rings
        this.drawOrbits();

        // Draw connections
        this.drawConnections();

        // Draw nodes
        this.nodes.forEach(node => {
            if (node.isFloating) {
                this.drawNode(node, node.x, node.y);
            } else {
                const angle = node.baseAngle + this.time * node.speed * 1000;
                const x = this.centerX + Math.cos(angle) * node.radius;
                const y = this.centerY + Math.sin(angle) * node.radius;
                this.drawNode(node, x, y);
            }
        });

        // Draw center glow
        const centerGradient = ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, 100
        );
        centerGradient.addColorStop(0, 'rgba(255, 107, 53, 0.05)');
        centerGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 100, 0, Math.PI * 2);
        ctx.fill();
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize visualization
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('ring-canvas');
    if (canvas) {
        new RingVisualization(canvas);
    }
});
