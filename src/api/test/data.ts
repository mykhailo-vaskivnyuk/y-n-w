import Joi from 'joi';
import { ITestResponse } from '../../client/common/server/types/types';
import { JOI_NULL } from '../../router/constants';
import { THandler } from '../../router/types';
import { TestResponseSchema } from '../schema/test.schema';

type ITestDataResponse = {
  field1: number | null;
  field2: ITestResponse;
}

const data: THandler<never, ITestDataResponse> =
  async () => ({
    field1: 100,
    field2: {
      field21: true,
      field22: 'text',
    }
  });
data.responseSchema = {
  field1: [JOI_NULL.required(), Joi.number().required()],
  field2: TestResponseSchema,
};

export = data;
