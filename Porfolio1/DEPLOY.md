# After authenticating, run these commands from the project folder:

# 1) GitHub
# Create empty repo: https://github.com/new  name: elion-krasniqi-portfolio
git remote add origin https://github.com/ElionKrasniqi0/elion-krasniqi-portfolio.git
git push -u origin main

# 2) Vercel CLI
npx vercel login
npx vercel --prod
