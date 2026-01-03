import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../ui/card";

function CommonCard({
  title,
  description,
  extraTextStyles = "",
  footerContent,
  content,
  headerRightContent,
  color,
  wrapperClass = "",
  draggable,
  onDragStart,
  onDoubleClick,
}) {
  return (
    <Card
      draggable={draggable}
      onDragStart={onDragStart}
      onDoubleClick={onDoubleClick}
      className={`
        flex flex-col gap-6 rounded-2xl p-8 transition
        ${color}
        ${wrapperClass}
        cursor-grab active:cursor-grabbing
        select-none mb-3
      `}
    >
      <CardHeader className="p-0">
        <div className="flex justify-between">
          <CardTitle className={`text-2xl truncate ${extraTextStyles}`}>
            {title}
          </CardTitle>
          {headerRightContent}
        </div>

        <CardDescription className="mt-3 font-semibold text-gray-800">
          {description}
        </CardDescription>
      </CardHeader>

      {content && <CardContent className="p-0">{content}</CardContent>}
      {footerContent && <CardFooter className="p-0">{footerContent}</CardFooter>}
    </Card>
  );
}

export default CommonCard;
