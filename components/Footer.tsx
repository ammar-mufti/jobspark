import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface-container-low dark:bg-primary-container border-t border-outline-variant dark:border-outline mt-16">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-headline-sm font-bold text-primary dark:text-inverse-primary">
            JobSpark
          </span>

          <div className="flex flex-wrap justify-center gap-6">
            {['About Us', 'Support', 'Privacy Policy', 'Terms of Service', 'Careers'].map(
              (label) => (
                <Link
                  key={label}
                  href="#"
                  className="text-body-sm text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors"
                >
                  {label}
                </Link>
              )
            )}
          </div>

          <p className="text-body-sm text-on-surface-variant dark:text-surface-variant text-center md:text-right">
            © 2025 JobSpark. All rights reserved.
            <br />
            Precision in every step.
          </p>
        </div>
      </div>
    </footer>
  )
}
