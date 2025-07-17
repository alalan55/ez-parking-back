import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerSpec = YAML.load("./swagger.yaml");

export { swaggerUi, swaggerSpec };
