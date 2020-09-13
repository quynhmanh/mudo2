using System;
using System.Runtime.ExceptionServices;

namespace RCB.TypeScript.Infrastructure
{
    public abstract class ServiceBase
    {

        public const string elasticsearchAddress = "http://host_container_address:9200";

        protected static Result Ok()
        {
            return new Result();
        }

        protected static Result<T> Ok<T>(T value)
        {
            return new Result<T>(value);
        }

        protected static Result<T> Error<T>(params string[] errors)
        {
            return new Result<T>(errors);
        }

        protected static Result Error(params string[] errors)
        {
            return new Result(errors);
        }

        protected static Result FatalError(params string[] errors)
        {
            return new Result(errors);
        }

        protected static Result FatalError(string errorMessage, Exception e)
        {
#if DEBUG
            ExceptionDispatchInfo.Capture(e).Throw();
#endif
            return new Result(errorMessage);
        }
    }
}