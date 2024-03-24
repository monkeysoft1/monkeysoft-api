import AppError from "../../entity/AppError";
import IGatewayRepository from "../../repository/IGatewayRepository";
import IProductRepository from "../../repository/IProductRepository";
import ISoftwareRepository from "../../repository/ISoftwareRepository";

export default class GetProductById {
  constructor(
    readonly productRepository: IProductRepository,
    readonly gatewayRepository: IGatewayRepository,
    readonly softwareRepository: ISoftwareRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do produto não foi informado", 404);
    }

    const product = await this.productRepository.getById(input.id);

    if (!product) {
      throw new AppError("Produto não localizado", 404);
    }

    const software = await this.softwareRepository.getById(product.software.id);

    let softwareDTO: SoftwareDTO | undefined = undefined;

    if (software) {
      softwareDTO = {
        id: software.id,
        name: software.name,
        description: software.description,
        active: software.active,
        created_on: software.created_on,
      };
    }

    product.gateways = await this.gatewayRepository.getByProductId(product.id);
    console.log("Bati aqui.");
    console.log(product.gateways);

    const gatewayDTO = product.gateways.map((f) => ({
      id: f.id,
      description: f.description,
      payment_gateway_key: f.payment_gateway_key,
      id_gateway_product: f.id_gateway_product,
      active: f.active,
      created_on: f.created_on,
      updated_on: f.updated_on,
    }));

    console.log("Lista final aqui.");
    console.log(gatewayDTO);

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      active: product.active,
      created_on: product.created_on,
      software: softwareDTO,
      gateways: gatewayDTO,
    };
  }
}

interface Input {
  id: string;
}

interface SoftwareDTO {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_on?: Date;
}

interface GatewayDTO {
  id: string;
  description: string;
  id_gateway_product: string;
  payment_gateway_key: string;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
}

interface Output {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
  software?: SoftwareDTO;
  gateways: GatewayDTO[];
}
