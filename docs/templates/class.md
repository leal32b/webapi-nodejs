# Class

## Class name
- [ ] Names in PascalCase
- [ ] No `default` export

```typescript
export class Example {
  
}
```

## Generics
- [ ] PascalCase Generics name ending with `Type`
```typescript
export class Example<SomeType> {
  
}
```

## Properties
- [ ] Property `private` or `protected`, `readonly`
- [ ] Property name starting with `_`
- [ ] Property type
```typescript
private readonly _property1: Type
protected readonly _property2: Type
```

## Constructor
- [ ] Private constructor
- [ ] Property name as `props` for `constructor`
- [ ] Use constructor shorthand
```typescript
private constructor (private readonly props: Type) {}
```

## Create method
- [ ] `public static create` method
```typescript
public static create (param: ParamType): Example {
  return new Example()
}
```

## Methods
- [ ] Methods grouped by group hierarchy, subgroup hierarchy and alphabetically
- [ ] Group hierarchy order: `public`, `protected`, `abstract`, `private`, `get`
- [ ] Subgroup hierarchy order: `static`, non-static
- [ ] Types for params and returns
```typescript
public static method1 (param: ParamType): ReturnType {}

public method2 (param: ParamType): ReturnType {}

protected method3 (param: ParamType): ReturnType {}

abstract method4 (param: ParamType): RerunType {}

private method5 (param: ParamType): RerunType {}

get property1 (): ReturnType {}
```
