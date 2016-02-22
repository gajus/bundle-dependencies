export default (packageDefinition: Object): Array<string> => {
    const dependencies = packageDefinition.dependencies || [];

    return Object.keys(dependencies).sort();
};
