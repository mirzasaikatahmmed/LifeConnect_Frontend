export default function Footer() {
  return (
    <footer className="bg-background border-t border-foreground/10 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">LifeConnect</h3>
            <p className="text-foreground/70 text-sm">
              Connecting lives, building communities.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-foreground/70 hover:text-foreground text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-foreground/70 hover:text-foreground text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-foreground/70 hover:text-foreground text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-foreground/70 hover:text-foreground text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/terms" className="text-foreground/70 hover:text-foreground text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-foreground/10 mt-8 pt-8 text-center">
          <p className="text-foreground/70 text-sm">
            © 2025 LifeConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}