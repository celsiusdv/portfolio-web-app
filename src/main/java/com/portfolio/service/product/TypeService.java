package com.portfolio.service.product;

import com.portfolio.dto.product.TypeDetails;
import com.portfolio.exception.ProductException;
import com.portfolio.model.product.Product;
import com.portfolio.model.product.Type;
import com.portfolio.repository.product.TypeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TypeService {

    @Autowired
    private TypeRepository typeRepository;

    protected Type getType(String type){
        return typeRepository.findTypeByName(type)
                .orElseGet( () ->{
                    log.info("\u001B[33mProduct type: \u001B[35m'"+type+"'\u001B[0m not found\u001B[0m");
                    return null;
                });
    }
    public List<TypeDetails> getProductTypes(){
        List<Type> types = typeRepository.findAll();
        if (types.isEmpty()) {
            log.error("No product types found -> getproductTypes()");
            throw new ProductException("No product types found", HttpStatus.NOT_FOUND);
        } else {
            return types.stream()
                    .map(type -> new TypeDetails(type.getId(),type.getProductType()))
                    .collect(Collectors.toList());
        }
    }

    public List<TypeDetails> getTypesBySector(String sector){
        List<Type> types = typeRepository.findTypesBySector(sector);
        if(types.isEmpty()){
            log.error("No types found in sector: "+sector+" -> getTypesBySector()");
            throw new ProductException("No types found in sector: "+sector, HttpStatus.NOT_FOUND);
        } else {
            return types.stream()
                    .map(type -> new TypeDetails(type.getId(),type.getProductType()))
                    .collect(Collectors.toList());
        }
    }

    public String deleteType(Integer id){
        return typeRepository.findTypeById(id)
                .map(type -> {
                    List<Product> products = new ArrayList<>(type.getProducts());
                    for(Product product:products){
                        type.removeProduct(product);
                    }
                    typeRepository.delete(type);
                    return "Type deleted successfully";
                }).orElseGet(()-> {
                    log.error("\u001B[35mType to delete doesn't exists\u001B[0m");
                    throw new ProductException("Type to delete doesn't exists", HttpStatus.NOT_FOUND);
                });
    }
}
