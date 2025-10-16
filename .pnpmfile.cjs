// pnpm configuration file
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Ensure consistent package versions
      if (pkg.dependencies) {
        // Add any package version overrides here if needed
      }
      return pkg;
    }
  }
};
